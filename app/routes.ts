import { type RouteConfig, index, prefix, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("archive", "./routes/archive.tsx"),
    route("archive/scoreboard/:id", "./routes/scoreboard.tsx"),
   
    route("news", "./routes/news/news.tsx"),
    route("news/upload", "./routes/news/article-upload.tsx"),
    route("news/:id", "./routes/news/article-view.tsx"),
    route("news/:id/edit", "./routes/news/article-edit.tsx"),
   
    route("private/admin", "./routes/admin/admin.tsx"),
    route("private/upload", "./routes/admin/upload.tsx"),
   
    route("gallery", "./routes/gallery/album-list.tsx"),
    route("gallery/upload", "./routes/gallery/album-upload.tsx"),
    route("gallery/:id", "./routes/gallery/album-view.tsx"),
    
    route("halloffame", "./routes/halloffame/halloffame.tsx"),
    route("halloffame/upload", "./routes/halloffame/fame-upload.tsx"),
    route("halloffame/contestant/:id", "./routes/halloffame/contestant.tsx"),
    route("halloffame/team/:id", "./routes/halloffame/team.tsx")
] satisfies RouteConfig;
