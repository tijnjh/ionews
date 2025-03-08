import {
  IonAvatar,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonNote,
} from "@ionic/react";
import { arrowUp } from "ionicons/icons";
import { formatUrl, relativify } from "../lib/helpers";

export default function StoryListItem({ story }: { story: any }) {
  return (
    <IonItemSliding>
      <IonItem routerLink={`/story/${story.id}`} detail={true}>
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
            {story.score}
            <IonIcon icon={arrowUp} />
            <span style={{ marginInline: ".5rem" }}>&bull;</span>
            <span style={{ flexShrink: 0 }}>{relativify(story.time)}</span>
            <span style={{ marginInline: ".5rem" }}>&bull;</span>
            <span
              style={{
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            >
              {formatUrl(story.url)}
            </span>
          </h3>
        </IonLabel>
        <IonNote>{story.descendants}</IonNote>
      </IonItem>
      <IonItemOptions side="start">
        <IonItemOption href={story.url} target="_blank">
          Open URL
        </IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  );
}
