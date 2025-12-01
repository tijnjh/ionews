import type { RouteComponentProps } from 'react-router'
import type { Story } from '@/lib/types'
import { IonAvatar, IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonPage, IonRefresher, IonRefresherContent, IonSpinner, IonToolbar } from '@ionic/react'
import { useQuery } from '@tanstack/react-query'
import { arrowUp, openOutline } from 'ionicons/icons'
import { haptic } from 'ios-haptics'
import { useState } from 'react'
import { CommentItem } from '@/components/CommentItem'
import { api } from '@/lib/api'
import { formatUrl } from '@/lib/utils'

export default function StoryPage({ match: { params } }: RouteComponentProps<{ id: string }>) {
  const [collapsedThreads, setCollapsedThreads] = useState<Set<number>>(() => new Set())

  function toggleCollapse(commentId: number) {
    haptic()
    const newSet = new Set(collapsedThreads)
    newSet[newSet.has(commentId) ? 'delete' : 'add'](commentId)
    setCollapsedThreads(newSet)
  }

  const { isPending, data, refetch } = useQuery({
    queryKey: [`story-${params.id}`],
    queryFn: () => api<Story>(`/item/${params.id}`),
  })

  const sessionStory = sessionStorage.getItem(params.id)
  const story = sessionStory ? JSON.parse(sessionStory) as Story : data

  const comments = data?.comments || story?.comments || []

  const isExternalLink = story?.url.startsWith('http')

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text="Frontpage" default-href="/" />
          </IonButtons>

          <IonButtons slot="end">
            {isExternalLink && (
              <IonButton href={story?.url} target="_blank">
                {story?.url && formatUrl(story.url)}
                <IonIcon slot="end" icon={openOutline} />
              </IonButton>
            )}
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent color="light">
        <IonRefresher
          slot="fixed"
          onIonRefresh={async (e) => {
            await refetch()
            e.detail.complete()
          }}
        >
          <IonRefresherContent />
        </IonRefresher>

        {story && (
          <>
            <IonList className="mb-2">
              <IonItem
                href={isExternalLink ? story.url : undefined}
                target="_blank"
              >
                <IonAvatar
                  aria-hidden="true"
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
                    <span className="mx-2">
                      &bull;
                    </span>
                    {story.user}
                    <span className="mx-2">
                      &bull;
                    </span>
                    <span className="shrink-0">
                      {story.time_ago}
                    </span>
                    {isExternalLink && (
                      <>
                        <span className="mx-2">
                          &bull;
                        </span>
                        <span className="truncate">
                          {formatUrl(story.url)}
                        </span>
                      </>
                    )}
                  </h3>
                </IonLabel>
              </IonItem>
            </IonList>
            {comments && comments.map(comment => (
              <IonList key={comment.id} className="mb-2">
                <CommentItem
                  comment={comment}
                  collapsedThreads={collapsedThreads}
                  toggleCollapse={toggleCollapse}
                />
              </IonList>
            ))}
          </>
        )}
        {isPending && <IonSpinner className="my-8 w-full" />}

      </IonContent>
    </IonPage>
  )
}
