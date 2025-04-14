import { createRouter, createWebHistory } from "@ionic/vue-router";
var routes = [
    {
        path: "/",
        component: function () { return import("../pages/HomePage.vue"); },
    },
    {
        path: "/story/:id",
        component: function () { return import("../pages/StoryPage.vue"); },
    },
];
var router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes,
});
export default router;
