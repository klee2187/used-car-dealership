// Route handlers for static pages

export function home(req, res) {
    res.render("home", { title: "Home" });
}

export function about(req, res) {
    res.render("about", { title: "About" });
}