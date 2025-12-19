import { type RouteConfig, index, prefix, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("archive", "./routes/archive.tsx"),
    route("archive/scoreboard/:id", "./routes/scoreboard.tsx"),
    route("news", "./routes/news/news.tsx"),
    route("news/:id", "./routes/news/article.tsx"),
    route("private/admin", "./routes/admin/admin.tsx"),
    route("gallery", "./routes/gallery.tsx"),
    route("halloffame", "./routes/halloffame.tsx"),
] satisfies RouteConfig;
