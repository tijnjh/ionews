import type { Story } from '@/lib/types'
import { IonAvatar, IonIcon, IonItem, IonLabel, IonNote } from '@ionic/react'
import { arrowUp } from 'ionicons/icons'
import { formatUrl, relativify } from '@/lib/utils'

export default function StoryListing({ story }: { story: Story }) {
  return (
    <IonItem
      routerLink={`/story/${story.id}`}
      draggable={false}
      detail
      className="select-none"
    >
      <IonAvatar
        aria-hidden
        slot="start"
      >
        <img
          className="rounded-sm! bg-(--gray-5)"
          src={`https://www.google.com/s2/favicons?domain=${story.url}&sz=64`}
        />
      </IonAvatar>
      <IonLabel>
        <h2>{story.title}</h2>
        <h3 className="flex items-center">
          {story.points}
          <IonIcon icon={arrowUp} />
          <span className="mx-2">&bull;</span>
          <span className="shrink-0">{relativify(story.time)}</span>
          {story.url.startsWith('http') && (
            <>
              <span className="mx-2">&bull;</span>
              <span className="truncate">
                {formatUrl(story.url)}
              </span>
            </>
          )}
        </h3>
      </IonLabel>
      <IonNote>{story.comments_count}</IonNote>
    </IonItem>
  )
}
