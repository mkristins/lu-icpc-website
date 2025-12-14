import { type RouteConfig, index, prefix, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("archive", "./routes/archive.tsx"),
    route("news", "./routes/news/home.tsx"),
    route("news/:id", "./routes/news/article.tsx"),
    // ...prefix("news", [
    //     index("./routes/news/home.tsx"),
    //     route(":id", "./routes/news/article.tsx")
    // ]),
    route("gallery", "./routes/gallery.tsx"),
    route("halloffame", "./routes/halloffame.tsx")
] satisfies RouteConfig;
