cmake_minimum_required(VERSION 3.15)

set(CMAKE_BUILD_TYPE Debug CACHE STRING "")
project(RealmCore)

list(APPEND CMAKE_MODULE_PATH "${CMAKE_CURRENT_SOURCE_DIR}/tools/cmake")

# Include general CMake modules
include(GNUInstallDirs)
include(CheckIncludeFiles)
include(CheckSymbolExists)
include(GetGitRevisionDescription)
include(Utilities)
include(SpecialtyBuilds)
include(GetVersion)
include(CheckCXXCompilerFlag)
include(CheckCXXSourceRuns)

include(CodeCoverage)

# Get accurate git-describe version
git_describe(REALM_VERSION)
set(PROJECT_VERSION ${DEP_VERSION})

# Project-wide build flags
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

if(NOT APPLE)
    # TODO: Core APIs should always built for internal usage. But there seems to be issues with cocoa. Enable it only for Android for now.
    set(CMAKE_CXX_VISIBILITY_PRESET hidden)
elseif(APPLE)
    set(CMAKE_VISIBILITY_INLINES_HIDDEN 1)
endif()

function(add_cxx_flag_if_supported flag)
    if(flag MATCHES "^-Wno-")
        # Compilers ignore unknown -Wno-foo flags, so look for -Wfoo instead.
        string(REPLACE "-Wno-" "-W" check_flag ${flag})
    else()
        set(check_flag ${flag})
    endif()

    check_cxx_compiler_flag(${check_flag} HAVE${check_flag})
    if(HAVE${check_flag})
        add_compile_options($<$<COMPILE_LANGUAGE:CXX>:${flag}>)
    endif()
endfunction()

function(use_faster_linker)
    # If a linker has already been set, don't override.
    if ("${CMAKE_EXE_LINKER_FLAGS}" MATCHES "-fuse-ld=")
        return()
    endif()

    foreach(LINKER lld gold) # lld > gold > default
        # there is no link equivalent to check_cxx_compiler_flag()
        set(CMAKE_REQUIRED_LINK_OPTIONS "-fuse-ld=${LINKER}")
        check_cxx_source_compiles("int main() {}" HAVE_LINKER_${LINKER})
        if(HAVE_LINKER_${LINKER})
            message(STATUS "Using linker ${LINKER}")
            add_link_options("-fuse-ld=${LINKER}")
            return()
        endif()
    endforeach()
endfunction()

# Set global warnings settings
if(MSVC)
    add_compile_options(/W3 /D_CRT_SECURE_NO_WARNINGS /D_SCL_SECURE_NO_WARNINGS)
else()
    add_compile_options(-Wall -Wextra -Wempty-body -Wparentheses -Wunknown-pragmas -Wunreachable-code -Wunused-parameter -Wno-missing-field-initializers)
    # TODO: Remove this when fixed
    if(ANDROID)
        add_compile_options(-Wno-uninitialized)
    elseif(${CMAKE_CXX_COMPILER_ID} MATCHES ".*[Cc]lang")
        # FIXME: Re-introduce -Wold-style-cast 
        add_compile_options(-Wunreachable-code -Wshorten-64-to-32 -Wconditional-uninitialized -Wextra-semi -Wno-nested-anon-types -Wdocumentation -Wthread-safety -Wthread-safety-negative)
    endif()

    add_cxx_flag_if_supported(-Wpartial-availability)

    # This warning is too agressive. It warns about moves that are not redundant on older
    # compilers that we still support. It is also harmless, unlike pessimizing moves.
    add_cxx_flag_if_supported(-Wno-redundant-move)

    # Ninja buffers output so we need to tell the compiler to use colors even though stdout isn't a tty.
    if("${CMAKE_GENERATOR}" STREQUAL "Ninja")
        add_cxx_flag_if_supported(-fdiagnostics-color)
    endif()

    use_faster_linker()
endif()

if(ANDROID)
    # Optimize for size vs. performance for Android. The has the following implications:
    # - Add `-ffunction-sections` and `-fdata-sections`. This requires that `-Wl,-gc-sections` are used when creating
    #   the final .so file.
    # - `-fstrict-aliasing` is inherited from NDK r10e.
    # - `-fomit-frame-pointer` is inherited from NDK r10e.
    # - On some architectures char is unsigned by default. Make it signed
    # - Compile with -Oz in Release because on Android we favor code size over performance
    # 
    add_compile_options(-fdata-sections -ffunction-sections -fomit-frame-pointer -fsigned-char -fstrict-aliasing -funwind-tables -no-canonical-prefixes $<$<CONFIG:Release>:-Oz>)
endif()

set(OPENSSL_VERSION ${DEP_OPENSSL_VERSION})

set(CMAKE_DEBUG_POSTFIX "-dbg")
set(CMAKE_MINSIZEDEBUG_POSTFIX "-dbg")

set(CMAKE_POSITION_INDEPENDENT_CODE ON)

if(CMAKE_SYSTEM_NAME MATCHES "^Windows")
    add_definitions(
        /DWIN32_LEAN_AND_MEAN
        /DUNICODE
        /D_UNICODE
    )
endif()

if(MSVC)
    add_compile_options(
        /MP # Enable multi-processor compilation
    )
    if(WINDOWS_STORE)
        # Removing LNK4075 warnings for debug UWP builds
        # "LNK4075: ignoring '/INCREMENTAL' due to '/OPT:ICF' specification"
        # "LNK4075: ignoring '/INCREMENTAL' due to '/OPT:REF' specification"

        # Optional verification checks since we don't know existing contents of variables below
        string(REPLACE "/OPT:ICF " "/OPT:NOICF " CMAKE_EXE_LINKER_FLAGS_DEBUG "${CMAKE_EXE_LINKER_FLAGS_DEBUG}")
        string(REPLACE "/OPT:REF " "/OPT:NOREF " CMAKE_EXE_LINKER_FLAGS_DEBUG "${CMAKE_EXE_LINKER_FLAGS_DEBUG}")
        string(REPLACE "/INCREMENTAL:YES " "/INCREMENTAL:NO " CMAKE_EXE_LINKER_FLAGS_DEBUG "${CMAKE_EXE_LINKER_FLAGS_DEBUG}")
        string(REPLACE "/INCREMENTAL " "/INCREMENTAL:NO " CMAKE_EXE_LINKER_FLAGS_DEBUG "${CMAKE_EXE_LINKER_FLAGS_DEBUG}")

        # Mandatory
        set(CMAKE_MODULE_LINKER_FLAGS_DEBUG  "${CMAKE_MODULE_LINKER_FLAGS_DEBUG} /INCREMENTAL:NO /OPT:NOREF /OPT:NOICF")
        set(CMAKE_EXE_LINKER_FLAGS_DEBUG     "${CMAKE_EXE_LINKER_FLAGS_DEBUG} /INCREMENTAL:NO /OPT:NOREF /OPT:NOICF")
        set(CMAKE_SHARED_LINKER_FLAGS_DEBUG  "${CMAKE_SHARED_LINKER_FLAGS_DEBUG} /INCREMENTAL:NO /OPT:NOREF /OPT:NOICF")
    else()
        set(CMAKE_MSVC_RUNTIME_LIBRARY "MultiThreaded$<$<CONFIG:Debug>:Debug>")
        string(REGEX REPLACE "/RTC(su|[1su])" "" CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS}")
    endif()

    # Let the compiler optimize debug builds ever so slightly.
    # /Ob1: This allows the compiler to inline functions marked __inline.
    # /Oi:  This enables (faster) intrinsic functions.
    string(REPLACE "/Ob0" "/Ob1" CMAKE_CXX_FLAGS_DEBUG "${CMAKE_CXX_FLAGS_DEBUG}")
    add_compile_options($<$<CONFIG:Debug>:/Oi>)

    # Prevent warnings abount non-existing .pdb files
    add_link_options($<$<CONFIG:Debug>:/ignore:4099>)
endif()

if(UNIX)
    # Enable access to large file APIs, but don't make them the default.
    add_compile_definitions("_LARGEFILE_SOURCE" "_LARGEFILE64_SOURCE")
    set(CMAKE_REQUIRED_DEFINITIONS "-D_LARGEFILE_SOURCE" "-D_LARGEFILE64_SOURCE")
    # Use readdir64 if available.
    check_symbol_exists(readdir64 "dirent.h" REALM_HAVE_READDIR64)
endif()

if (NOT APPLE)
    set(REALM_INCLUDE_CERTS_DEFAULT ON)
else()
    set(REALM_INCLUDE_CERTS_DEFAULT OFF)
endif()

# Options (passed to CMake)
option(REALM_ENABLE_SYNC "Enable synchronized realms." ON)
option(REALM_BUILD_TEST_CLIENT "Build the test client" OFF)
option(REALM_BUILD_DOGLESS "Build server with support for emitting statsd" OFF)
option(REALM_BUILD_INSPECTOR "Build inspector" OFF)
option(REALM_ENABLE_ASSERTIONS "Enable assertions in release mode." OFF)
option(REALM_ENABLE_ALLOC_SET_ZERO "Zero all allocations." OFF)
option(REALM_ENABLE_ENCRYPTION "Enable encryption." ON)
option(REALM_ENABLE_MEMDEBUG "Add additional memory checks" OFF)
option(REALM_VALGRIND "Tell the test suite we are running with valgrind" OFF)
option(REALM_METRICS "Enable various metric tracking" ON)
option(REALM_INCLUDE_CERTS "Include a list of trust certificates in the build for SSL certificate verification" ${REALM_INCLUDE_CERTS_DEFAULT})
set(REALM_MAX_BPNODE_SIZE "1000" CACHE STRING "Max B+ tree node size.")

if(APPLE AND NOT REALM_FORCE_OPENSSL)
    set(REALM_HAVE_SECURE_TRANSPORT "1")
endif()

# Find dependencies
set(THREADS_PREFER_PTHREAD_FLAG ON)
find_package(Threads REQUIRED)
find_package(BISON 3.7.4)
find_package(FLEX 2.6.4)

set(REALM_NEEDS_OPENSSL ${REALM_FORCE_OPENSSL})
if(UNIX AND NOT APPLE)
    set(REALM_NEEDS_OPENSSL ON)
elseif(REALM_ENABLE_SYNC AND CMAKE_SYSTEM_NAME MATCHES "^Windows")
    set(REALM_NEEDS_OPENSSL ON)
    set(REALM_USE_SYSTEM_OPENSSL ON)
endif()
if(REALM_NEEDS_OPENSSL)
    if(REALM_USE_SYSTEM_OPENSSL)
        # Use system OpenSSL
        find_package(OpenSSL REQUIRED)
    else()
        # Use our OpenSSL
        if(NOT OpenSSL_DIR)
            if(NOT EXISTS ${CMAKE_CURRENT_BINARY_DIR}/openssl/lib/cmake/OpenSSL/OpenSSLConfig.cmake)
                set(OPENSSL_URL "http://static.realm.io/downloads/openssl/${OPENSSL_VERSION}/Android/x86/openssl.tar.gz")


                message(STATUS "Getting ${OPENSSL_URL}...")
                file(DOWNLOAD "${OPENSSL_URL}" "${CMAKE_CURRENT_BINARY_DIR}/openssl/openssl.tar.gz" STATUS download_status)

                list(GET download_status 0 status_code)
                if (NOT "${status_code}" STREQUAL "0")
                    message(FATAL_ERROR "Downloading ${url}... Failed. Status: ${download_status}")
                endif()

                message(STATUS "Uncompressing OpenSSL...")
                execute_process(
                    COMMAND ${CMAKE_COMMAND} -E tar xfz "openssl.tar.gz"
                    WORKING_DIRECTORY "${CMAKE_CURRENT_BINARY_DIR}/openssl"
                )
            endif()

            set(OpenSSL_DIR "${CMAKE_CURRENT_BINARY_DIR}/openssl/lib/cmake/OpenSSL")
        endif()
        find_package(OpenSSL REQUIRED CONFIG)
        target_link_libraries(OpenSSL::SSL INTERFACE OpenSSL::Crypto)
    endif()

    set(REALM_HAVE_OPENSSL ON)
    string(REGEX MATCH "^([0-9]+)\\.([0-9]+)" OPENSSL_VERSION_MAJOR_MINOR ${OPENSSL_VERSION})
endif()

# Use Zlib for Sync, but allow integrators to override it
# Don't use find_library(ZLIB) on Apple platforms - it hardcodes the path per platform,
# so for an iOS build it'll use the path from the Device plaform, which is an error on Simulator.
# Just use -lz and let Xcode figure it out
if(REALM_ENABLE_SYNC AND NOT APPLE AND NOT TARGET ZLIB::ZLIB)
    if(ANDROID)
        # On Android FindZLIB chooses the static libz over the dynamic one, but this leads to issues
        # (see https://github.com/android/ndk/issues/1179)
        # We want to link against the stub library instead of statically linking anyway,
        # so we hack find_library to only consider shared object libraries when looking for libz
        set(_CMAKE_FIND_LIBRARY_SUFFIXES_orig ${CMAKE_FIND_LIBRARY_SUFFIXES})
        set(CMAKE_FIND_LIBRARY_SUFFIXES .so)
    endif()
    find_package(ZLIB REQUIRED)
    if(ANDROID)
        set(CMAKE_FIND_LIBRARY_SUFFIXES ${_CMAKE_FIND_LIBRARY_SUFFIXES_orig})
    endif()
endif()

# Store configuration in header file
configure_file(src/realm/util/config.h.in src/realm/util/config.h)

# Configure source code to use right version number
configure_file(src/realm/version_numbers.hpp.in src/realm/version_numbers.hpp)

set(DEPRECATED_CONFIG_FILE "${RealmCore_SOURCE_DIR}/src/realm/util/config.h")
if(EXISTS "${DEPRECATED_CONFIG_FILE}")
    message(FATAL_ERROR "${DEPRECATED_CONFIG_FILE} exists in the source directory, and will take precedence over the generated configuration in the build directory. Please remove this file before continuing. Alternatively, you can also clean your realm-core to remove this and other stale files: git clean -xfd")
endif()

set(CATCH_INCLUDE_DIR ${CMAKE_CURRENT_SOURCE_DIR}/external/catch/single_include)
set(JSON_INCLUDE_DIR ${CMAKE_CURRENT_SOURCE_DIR}/external/json)

# Tell the build system where to find the sources (and generated sources)
include_directories(src)
include_directories(${CMAKE_CURRENT_BINARY_DIR}/src) # For generated files (like config.h)

# Include additional CMakeLists
add_subdirectory(src)

if (REALM_BUILD_DOGLESS)
    set(REALM_HAVE_DOGLESS ON)
    add_subdirectory(src/dogless)
endif()

# Enable CTest and include unit tests
if(NOT REALM_BUILD_LIB_ONLY AND NOT REALM_NO_TESTS)
    enable_testing()
    add_subdirectory(test)
    if (REALM_BUILD_TEST_CLIENT)
        add_subdirectory(test/client)
    endif()
endif()

# Install the licence and changelog files
install(FILES LICENSE CHANGELOG.md DESTINATION "doc/realm" COMPONENT devel)

# Only prepare install/package targets if we're not a submodule
if(NOT CMAKE_SOURCE_DIR STREQUAL ${CMAKE_CURRENT_SOURCE_DIR})
    return()
endif()

# Make the project importable from the build directory
set(REALM_EXPORTED_TARGETS
    Storage
    QueryParser
    ObjectStore
    RealmFFI
    RealmFFIStatic
)
if(REALM_ENABLE_SYNC)
    list(APPEND REALM_EXPORTED_TARGETS Sync)
endif()
export(TARGETS ${REALM_EXPORTED_TARGETS} NAMESPACE Realm:: FILE RealmTargets.cmake)
configure_file(${CMAKE_CURRENT_LIST_DIR}/tools/cmake/RealmConfig.cmake.in ${CMAKE_CURRENT_BINARY_DIR}/RealmConfig.cmake @ONLY)

# Make the project importable from the install directory
install(EXPORT realm
        NAMESPACE Realm::
        FILE RealmTargets.cmake
        DESTINATION lib/cmake/Realm
        COMPONENT devel
)

install(FILES ${CMAKE_CURRENT_BINARY_DIR}/RealmConfig.cmake 
        DESTINATION lib/cmake/Realm
        COMPONENT devel
)

# CPack
set(CPACK_GENERATOR "TGZ")
set(CPACK_PACKAGE_NAME "realm-${CMAKE_BUILD_TYPE}")
set(CPACK_PACKAGE_VERSION ${REALM_VERSION})
set(CPACK_ARCHIVE_COMPONENT_INSTALL ON)
include(CPack)
cpack_add_component(runtime DEPENDS runtime)
cpack_add_component(devel DEPENDS devel)
