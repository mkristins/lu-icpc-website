import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("archive", "./routes/archive.tsx"),
    route("news", "./routes/news.tsx"),
    route("gallery", "./routes/gallery.tsx")
] satisfies RouteConfig;
