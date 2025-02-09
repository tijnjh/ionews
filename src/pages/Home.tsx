import PostListItem from "../components/PostListItem";
import { useEffect, useState } from "react";
import {
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from "@ionic/react";

import type { Post } from "../types/post";

async function fetchPosts(page: number) {
  const url = `https://node-hnapi.herokuapp.com/news?page=${page}`;
  const response = await (await fetch(url)).json();
  return response;
}

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadPosts(page);
  }, []);

  async function loadPosts(page: number) {
    setIsLoading(true);
    const response = await fetchPosts(page);
    setPosts((prevPosts) => [...prevPosts, ...response]);
    setIsLoading(false);
  }

  function loadMore(event: any) {
    setPage((prevPage) => prevPage + 1);
    loadPosts(page + 1).then(() => {
      event.target.complete();
    });
  }

  return (
    <IonPage id="home-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Frontpage</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Frontpage</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonList>
          {posts.map((post) => (
            <PostListItem key={post.id} post={post} />
          ))}
        </IonList>

        <IonInfiniteScroll
          onIonInfinite={loadMore}
          threshold="100px"
          disabled={isLoading}
        >
          <IonInfiniteScrollContent
            loadingSpinner="bubbles"
            loadingText="Loading more posts..."
          ></IonInfiniteScrollContent>
        </IonInfiniteScroll>
      </IonContent>
    </IonPage>
  );
};

export default Home;
