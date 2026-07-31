
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * This module provides access to environment variables that are injected _statically_ into your bundle at build time and are limited to _private_ access.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Static environment variables are [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env` at build time and then statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * **_Private_ access:**
 * 
 * - This module cannot be imported into client-side code
 * - This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured)
 * 
 * For example, given the following build time environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://site.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { ENVIRONMENT, PUBLIC_BASE_URL } from '$env/static/private';
 * 
 * console.log(ENVIRONMENT); // => "production"
 * console.log(PUBLIC_BASE_URL); // => throws error during build
 * ```
 * 
 * The above values will be the same _even if_ different values for `ENVIRONMENT` or `PUBLIC_BASE_URL` are set at runtime, as they are statically replaced in your code with their build time values.
 */
declare module '$env/static/private' {
	export const npm_execpath: string;
	export const CHROME_CRASHPAD_PIPE_NAME: string;
	export const npm_config_node_gyp: string;
	export const npm_config_init_module: string;
	export const NODE_ENV: string;
	export const ALLUSERSPROFILE: string;
	export const AI_AGENT: string;
	export const APPDATA: string;
	export const GIT_ASKPASS: string;
	export const COLOR: string;
	export const EDITOR: string;
	export const AUTO_APPROVAL: string;
	export const COMMONPROGRAMFILES: string;
	export const NODEFAULTCURRENTDIRECTORYINEXEPATH: string;
	export const LOGONSERVER: string;
	export const COMMONPROGRAMW6432: string;
	export const GIT_CONFIG_VALUE_0: string;
	export const COMPOSER_HOME: string;
	export const npm_config_userconfig: string;
	export const COMPUTERNAME: string;
	export const COMSPEC: string;
	export const npm_package_version: string;
	export const HOMEDRIVE: string;
	export const COPILOT_AGENT_SESSION_ID: string;
	export const COPILOT_CLI: string;
	export const GIT_CONFIG_COUNT: string;
	export const COPILOT_CLI_RUN_AS_NODE: string;
	export const npm_package_name: string;
	export const COPILOT_MCP_APPS: string;
	export const DATAGRIP: string;
	export const GIT_TERMINAL_PROMPT: string;
	export const DRIVERDATA: string;
	export const npm_config_noproxy: string;
	export const PSMODULEPATH: string;
	export const FPS_BROWSER_APP_PROFILE_STRING: string;
	export const PROGRAMDATA: string;
	export const FPS_BROWSER_USER_PROFILE_STRING: string;
	export const GCM_INTERACTIVE: string;
	export const JAVA_HOME: string;
	export const GIT_CONFIG_KEY_0: string;
	export const NVM_HOME: string;
	export const GIT_CONFIG_KEY_1: string;
	export const GIT_CONFIG_VALUE_1: string;
	export const GOPATH: string;
	export const npm_config_global_prefix: string;
	export const HOME: string;
	export const HOMEPATH: string;
	export const npm_lifecycle_event: string;
	export const INIT_CWD: string;
	export const LOCALAPPDATA: string;
	export const MXC_BIN_DIR: string;
	export const NODE: string;
	export const npm_command: string;
	export const npm_config_npm_version: string;
	export const npm_config_allow_scripts: string;
	export const NVM_SYMLINK: string;
	export const npm_config_cache: string;
	export const npm_config_globalconfig: string;
	export const npm_config_local_prefix: string;
	export const npm_config_prefix: string;
	export const npm_config_user_agent: string;
	export const npm_lifecycle_script: string;
	export const npm_node_execpath: string;
	export const WINDIR: string;
	export const npm_package_json: string;
	export const NUMBER_OF_PROCESSORS: string;
	export const OLLAMA_MODELS: string;
	export const ONEDRIVE: string;
	export const OS: string;
	export const PATH: string;
	export const PATHEXT: string;
	export const POWERSHELL_UPDATECHECK: string;
	export const PROCESSOR_ARCHITECTURE: string;
	export const PROCESSOR_IDENTIFIER: string;
	export const PROCESSOR_LEVEL: string;
	export const PROCESSOR_REVISION: string;
	export const PROGRAMFILES: string;
	export const PROGRAMW6432: string;
	export const PROMPT: string;
	export const PROTOC: string;
	export const PUBLIC: string;
	export const SESSIONNAME: string;
	export const SSH_ASKPASS: string;
	export const SYSTEMDRIVE: string;
	export const SYSTEMROOT: string;
	export const TEMP: string;
	export const TMP: string;
	export const USERDOMAIN: string;
	export const USERDOMAIN_ROAMINGPROFILE: string;
	export const USERNAME: string;
	export const USERPROFILE: string;
	export const USE_BUILTIN_RIPGREP: string;
	export const SVELTEKIT_FORK: string;
}

/**
 * This module provides access to environment variables that are injected _statically_ into your bundle at build time and are _publicly_ accessible.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Static environment variables are [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env` at build time and then statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * **_Public_ access:**
 * 
 * - This module _can_ be imported into client-side code
 * - **Only** variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`) are included
 * 
 * For example, given the following build time environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://site.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { ENVIRONMENT, PUBLIC_BASE_URL } from '$env/static/public';
 * 
 * console.log(ENVIRONMENT); // => throws error during build
 * console.log(PUBLIC_BASE_URL); // => "http://site.com"
 * ```
 * 
 * The above values will be the same _even if_ different values for `ENVIRONMENT` or `PUBLIC_BASE_URL` are set at runtime, as they are statically replaced in your code with their build time values.
 */
declare module '$env/static/public' {
	
}

/**
 * This module provides access to environment variables set _dynamically_ at runtime and that are limited to _private_ access.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Dynamic environment variables are defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`.
 * 
 * **_Private_ access:**
 * 
 * - This module cannot be imported into client-side code
 * - This module includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured)
 * 
 * > [!NOTE] In `dev`, `$env/dynamic` includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 * 
 * > [!NOTE] To get correct types, environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * >
 * > ```env
 * > MY_FEATURE_FLAG=
 * > ```
 * >
 * > You can override `.env` values from the command line like so:
 * >
 * > ```sh
 * > MY_FEATURE_FLAG="enabled" npm run dev
 * > ```
 * 
 * For example, given the following runtime environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://site.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * 
 * console.log(env.ENVIRONMENT); // => "production"
 * console.log(env.PUBLIC_BASE_URL); // => undefined
 * ```
 */
declare module '$env/dynamic/private' {
	export const env: {
		npm_execpath: string;
		CHROME_CRASHPAD_PIPE_NAME: string;
		npm_config_node_gyp: string;
		npm_config_init_module: string;
		NODE_ENV: string;
		ALLUSERSPROFILE: string;
		AI_AGENT: string;
		APPDATA: string;
		GIT_ASKPASS: string;
		COLOR: string;
		EDITOR: string;
		AUTO_APPROVAL: string;
		COMMONPROGRAMFILES: string;
		NODEFAULTCURRENTDIRECTORYINEXEPATH: string;
		LOGONSERVER: string;
		COMMONPROGRAMW6432: string;
		GIT_CONFIG_VALUE_0: string;
		COMPOSER_HOME: string;
		npm_config_userconfig: string;
		COMPUTERNAME: string;
		COMSPEC: string;
		npm_package_version: string;
		HOMEDRIVE: string;
		COPILOT_AGENT_SESSION_ID: string;
		COPILOT_CLI: string;
		GIT_CONFIG_COUNT: string;
		COPILOT_CLI_RUN_AS_NODE: string;
		npm_package_name: string;
		COPILOT_MCP_APPS: string;
		DATAGRIP: string;
		GIT_TERMINAL_PROMPT: string;
		DRIVERDATA: string;
		npm_config_noproxy: string;
		PSMODULEPATH: string;
		FPS_BROWSER_APP_PROFILE_STRING: string;
		PROGRAMDATA: string;
		FPS_BROWSER_USER_PROFILE_STRING: string;
		GCM_INTERACTIVE: string;
		JAVA_HOME: string;
		GIT_CONFIG_KEY_0: string;
		NVM_HOME: string;
		GIT_CONFIG_KEY_1: string;
		GIT_CONFIG_VALUE_1: string;
		GOPATH: string;
		npm_config_global_prefix: string;
		HOME: string;
		HOMEPATH: string;
		npm_lifecycle_event: string;
		INIT_CWD: string;
		LOCALAPPDATA: string;
		MXC_BIN_DIR: string;
		NODE: string;
		npm_command: string;
		npm_config_npm_version: string;
		npm_config_allow_scripts: string;
		NVM_SYMLINK: string;
		npm_config_cache: string;
		npm_config_globalconfig: string;
		npm_config_local_prefix: string;
		npm_config_prefix: string;
		npm_config_user_agent: string;
		npm_lifecycle_script: string;
		npm_node_execpath: string;
		WINDIR: string;
		npm_package_json: string;
		NUMBER_OF_PROCESSORS: string;
		OLLAMA_MODELS: string;
		ONEDRIVE: string;
		OS: string;
		PATH: string;
		PATHEXT: string;
		POWERSHELL_UPDATECHECK: string;
		PROCESSOR_ARCHITECTURE: string;
		PROCESSOR_IDENTIFIER: string;
		PROCESSOR_LEVEL: string;
		PROCESSOR_REVISION: string;
		PROGRAMFILES: string;
		PROGRAMW6432: string;
		PROMPT: string;
		PROTOC: string;
		PUBLIC: string;
		SESSIONNAME: string;
		SSH_ASKPASS: string;
		SYSTEMDRIVE: string;
		SYSTEMROOT: string;
		TEMP: string;
		TMP: string;
		USERDOMAIN: string;
		USERDOMAIN_ROAMINGPROFILE: string;
		USERNAME: string;
		USERPROFILE: string;
		USE_BUILTIN_RIPGREP: string;
		SVELTEKIT_FORK: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * This module provides access to environment variables set _dynamically_ at runtime and that are _publicly_ accessible.
 * 
 * |         | Runtime                                                                    | Build time                                                               |
 * | ------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
 * | Private | [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private) | [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private) |
 * | Public  | [`$env/dynamic/public`](https://svelte.dev/docs/kit/$env-dynamic-public)   | [`$env/static/public`](https://svelte.dev/docs/kit/$env-static-public)   |
 * 
 * Dynamic environment variables are defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`.
 * 
 * **_Public_ access:**
 * 
 * - This module _can_ be imported into client-side code
 * - **Only** variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`) are included
 * 
 * > [!NOTE] In `dev`, `$env/dynamic` includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 * 
 * > [!NOTE] To get correct types, environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * >
 * > ```env
 * > MY_FEATURE_FLAG=
 * > ```
 * >
 * > You can override `.env` values from the command line like so:
 * >
 * > ```sh
 * > MY_FEATURE_FLAG="enabled" npm run dev
 * > ```
 * 
 * For example, given the following runtime environment:
 * 
 * ```env
 * ENVIRONMENT=production
 * PUBLIC_BASE_URL=http://example.com
 * ```
 * 
 * With the default `publicPrefix` and `privatePrefix`:
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.ENVIRONMENT); // => undefined, not public
 * console.log(env.PUBLIC_BASE_URL); // => "http://example.com"
 * ```
 * 
 * ```
 * 
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
