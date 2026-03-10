export default defineNuxtPlugin(() => {
  const api = $fetch.create({
    baseURL: "https://node-hnapi.herokuapp.com",
  });

  return {
    provide: { api },
  };
});
