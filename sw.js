const cacheName = "cine-files";
const assets = [
    "/",
    "index.html",
    "css/style.css",
    "js/index.js",
    "js/lista.js",
    "detalles.html",
    "lista.html",
]

self.addEventListener('install', event => {
    console.log('SW. Se instalo');
    event.waitUntil(
        caches
        .open(cacheName)
        .then(cache => 
            cache.addAll(assets))
    )
})

self.addEventListener('activate', (event) => {
    console.log('SW. Se activo');
})

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches 
        .match(event.request)
        .then((respuesta) => {
            if(respuesta) {
                return respuesta;
            }
            let requestToCache =  event.request.clone()
            return fetch(requestToCache)
            .then(res => {
                if(!res || res.status !== 200){
                    return res;
                }
                let respuestaCache = res.clone();
                caches
                .open(cacheName)
                .then((cache) => {
                    cache.put(requestToCache, respuestaCache)
                })
                return res;
            })
        })
    )
})


