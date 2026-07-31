export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.ico","favicon.png","robots.txt"]),
	mimeTypes: {".png":"image/png",".txt":"text/plain"},
	_: {
		client: {start:"_app/immutable/entry/start.B4XWkITa.js",app:"_app/immutable/entry/app.DQBNDjh0.js",imports:["_app/immutable/entry/start.B4XWkITa.js","_app/immutable/chunks/C28y5r5u.js","_app/immutable/chunks/DZugGEQ_.js","_app/immutable/chunks/DkOVUTLo.js","_app/immutable/chunks/CMAO6jCs.js","_app/immutable/entry/app.DQBNDjh0.js","_app/immutable/chunks/DZugGEQ_.js","_app/immutable/chunks/Bk9O3ehT.js","_app/immutable/chunks/vQaydNG-.js","_app/immutable/chunks/CMAO6jCs.js","_app/immutable/chunks/fgzsLHAX.js","_app/immutable/chunks/BjB72jLj.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
