import { IonAvatar, IonIcon, IonItem, IonLabel, IonNote } from "@ionic/react";
import { formatDistance, subDays } from "date-fns";
import { arrowUp } from "ionicons/icons";

// const StoryListItem: React.FC<{ story: Story }> = ({ story }) => {
export default function StoryListItem({ story }: { story: any }) {
  return (
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
          &bull;{" "}
          {formatDistance(subDays(story.time * 1000, 3), new Date(), {
            addSuffix: true,
          })}
        </h3>
      </IonLabel>
      <IonNote>{story.descendants}</IonNote>
    </IonItem>
  );
}
