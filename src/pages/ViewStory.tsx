import { useEffect, useState } from "react";
import {
  IonAvatar,
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonText,
  IonToolbar,
  IonRefresher,
  IonRefresherContent,
  IonLoading,
  useIonViewWillEnter,
  IonIcon,
} from "@ionic/react";
import { useParams } from "react-router";
import "./ViewStory.css";
import { formatDistance, subDays } from "date-fns";
import { arrowUp } from "ionicons/icons";

async function fetchStory(id: number) {
  const url = `https://node-hnapi.herokuapp.com/item/${id}`;
  const response = await (await fetch(url)).json();
  return response;
}

function ViewMessage() {
  const [story, setStory] = useState<any>();
  const [collapsedThreads, setCollapsedThreads] = useState<Set<number>>(
    new Set()
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const params = useParams<{ id: string }>();

  const loadStory = async (id: number) => {
    setLoading(true);
    const storyData = await fetchStory(id);
    setStory(storyData);
    setLoading(false);
    setRefreshing(false);
  };

  useIonViewWillEnter(() => {
    loadStory(parseInt(params.id, 10));
  });

  const toggleCollapse = (commentId: number) => {
    setCollapsedThreads((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const handleRefresh = (event: any) => {
    loadStory(parseInt(params.id, 10));
  };

  useEffect(() => {
    document.querySelectorAll("a").forEach((a) => {
      a.target = "_blank";
    });
  }, []);

  return (
    <IonPage id="view-message-page">
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text="Frontpage" defaultHref="/"></IonBackButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent color="light">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <IonLoading isOpen={loading} message="Loading..." />

        {story ? (
          <>
            <IonList style={{ marginBottom: ".5rem" }}>
              <IonItem href={story.url} target="_blank">
                <IonAvatar
                  aria-hidden="true"
                  slot="start"
                  style={{ "--border-radius": ".25rem" }}
                >
                  <img
                    alt=""
                    src={`https://www.google.com/s2/favicons?domain=${story.url}&sz=64`}
                  />
                </IonAvatar>
                <IonLabel>
                  <h2>{story.title}</h2>
                  <h3 style={{ display: "flex", alignItems: "center" }}>
                    {story.points}
                    <IonIcon icon={arrowUp} />
                    &bull;{" "}
                    {formatDistance(subDays(story.time * 1000, 3), new Date(), {
                      addSuffix: true,
                    })}
                  </h3>
                </IonLabel>
              </IonItem>
            </IonList>

            {story.comments.map((comment: any) => (
              <IonList key={comment.id} style={{ marginBottom: ".5rem" }}>
                <IonItem>
                  <IonLabel>
                    <p
                      onClick={() => toggleCollapse(comment.id)}
                      style={{ cursor: "pointer" }}
                    >
                      {comment.user}
                    </p>
                    <div
                      className={`comment-content ${
                        collapsedThreads.has(comment.id)
                          ? "collapsed"
                          : "expanded"
                      }`}
                    >
                      <IonText>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: comment.content,
                          }}
                        ></div>
                      </IonText>
                    </div>
                  </IonLabel>
                </IonItem>
                {!collapsedThreads.has(comment.id) && (
                  <>
                    {comment.comments.map((reply: any) => (
                      <IonItem
                        key={reply.id}
                        style={{ paddingLeft: `${reply.level}rem` }}
                      >
                        <IonLabel>
                          <p>{reply.user}</p>
                          <div
                            className={`comment-content ${
                              collapsedThreads.has(comment.id)
                                ? "collapsed"
                                : "expanded"
                            }`}
                          >
                            <IonText>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: reply.content,
                                }}
                              ></div>
                            </IonText>
                          </div>
                        </IonLabel>
                      </IonItem>
                    ))}
                  </>
                )}
              </IonList>
            ))}
          </>
        ) : (
          ""
        )}
      </IonContent>
    </IonPage>
  );
}

export default ViewMessage;
