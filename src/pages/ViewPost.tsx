import { useEffect, useState } from "react";
import {
  IonAvatar,
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonPage,
  IonText,
  IonToolbar,
  useIonViewWillEnter,
} from "@ionic/react";
import { useParams } from "react-router";
import { Post } from "../types/post";
import "./ViewPost.css";

async function fetchPost(id: number) {
  const url = `https://node-hnapi.herokuapp.com/item/${id}`;
  const response = await (await fetch(url)).json();
  return response;
}

function ViewMessage() {
  const [post, setPost] = useState<Post>();
  const [collapsedThreads, setCollapsedThreads] = useState<Set<number>>(
    new Set()
  );
  const params = useParams<{ id: string }>();

  useIonViewWillEnter(() => {
    fetchPost(parseInt(params.id, 10)).then((p) => {
      setPost(p);
    });
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
            <IonBackButton text="Frontpage" defaultHref="/home"></IonBackButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent color="light">
        {post ? (
          <>
            <IonList style={{ marginBottom: ".5rem" }}>
              <IonItem href={post.url} target="_blank">
                <IonAvatar
                  aria-hidden="true"
                  slot="start"
                  style={{ "--border-radius": ".25rem" }}
                >
                  <img
                    alt=""
                    src={`https://www.google.com/s2/favicons?domain=${post.url}&sz=64`}
                  />
                </IonAvatar>
                <IonLabel>
                  <h2>{post.title}</h2>
                  <h3>
                    {post.points} points &bull; {post.time_ago}
                  </h3>
                </IonLabel>
              </IonItem>
            </IonList>

            {post.comments.map((comment) => (
              <>
                <IonList key={comment.id} style={{ marginBottom: ".5rem" }}>
                  <IonItem>
                    <IonLabel>
                      <p onClick={() => toggleCollapse(comment.id)}>
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
                      {comment.comments.map((reply) => (
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
              </>
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
