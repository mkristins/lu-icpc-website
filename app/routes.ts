import { type RouteConfig, index, prefix, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("archive", "./routes/archive.tsx"),
    route("archive/scoreboard/:id", "./routes/scoreboard.tsx"),
    route("news", "./routes/news/news.tsx"),
    route("news/:id", "./routes/news/article-view.tsx"),
    route("news/:id/edit", "./routes/news/article-edit.tsx"),
    route("private/admin", "./routes/admin/admin.tsx"),
    route("private/upload", "./routes/admin/upload.tsx"),
    route("gallery", "./routes/gallery.tsx"),
    route("halloffame", "./routes/halloffame.tsx"),
] satisfies RouteConfig;
