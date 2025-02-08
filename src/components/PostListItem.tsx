import { IonAvatar, IonItem, IonLabel, IonNote } from "@ionic/react";
import type { Post } from "../types/post";

const PostListItem: React.FC<{ post: Post }> = ({ post }) => {
  return (
    <IonItem routerLink={`/post/${post.id}`} detail={true}>
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
      <IonNote>{post.comments_count}</IonNote>
    </IonItem>
  );
};

export default PostListItem;
