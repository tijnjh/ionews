import StoryListItem from "../components/StoryListItem";
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
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
} from "@ionic/react";

const STORIES_PER_PAGE = 25;

async function fetchStoryIds(page: number, storiesPerPage: number) {
  const url = "https://hacker-news.firebaseio.com/v0/topstories.json";
  const response = await (await fetch(url)).json();
  const start = (page - 1) * storiesPerPage;
  return response.slice(start, start + storiesPerPage);
}

async function fetchStories(ids: number[]) {
  const baseUrl = "https://hacker-news.firebaseio.com/v0/item/";
  const fetchPromises = ids.map((id) =>
    fetch(`${baseUrl}${id}.json`).then((res) => res.json())
  );
  return Promise.all(fetchPromises);
}

export default function Home() {
  const [stories, setStories] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [showInitialSpinner, setShowInitialSpinner] = useState(true);

  useEffect(() => {
    loadStories(page);
  }, []);

  async function loadStories(page: number) {
    try {
      const storyIds = await fetchStoryIds(page, STORIES_PER_PAGE);
      const fetchedStories = await fetchStories(storyIds);
      setStories((prevStories) => [...prevStories, ...fetchedStories]);
    } catch (error) {
      console.error("Failed to load stories:", error);
    } finally {
      setShowInitialSpinner(false);
    }
  }

  function loadMore(event: any) {
    setPage((prevPage) => prevPage + 1);
    loadStories(page + 1).then(() => {
      event.target.complete();
    });
  }

  function handleRefresh(event: any) {
    setPage(1);
    setStories([]);
    loadStories(1).then(() => {
      event.detail.complete();
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
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Frontpage</IonTitle>
          </IonToolbar>
        </IonHeader>

        {!!showInitialSpinner && (
          <IonSpinner style={{ width: "100%", marginBlockStart: "2rem" }} />
        )}

        <IonList>
          {stories.map((story) => (
            <StoryListItem key={story.id} story={story} />
          ))}
        </IonList>

        <IonInfiniteScroll onIonInfinite={loadMore} threshold="100px">
          <IonInfiniteScrollContent></IonInfiniteScrollContent>
        </IonInfiniteScroll>
      </IonContent>
    </IonPage>
  );
}
