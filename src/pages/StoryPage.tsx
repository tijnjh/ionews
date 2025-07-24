/* eslint-disable react-dom/no-dangerously-set-innerhtml */
import type { Comment, Story } from '@/lib/types'
import { IonAvatar, IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonPage, IonSpinner, IonText, IonToolbar } from '@ionic/react'
import { useQuery } from '@tanstack/react-query'
import { arrowUp, chevronDown, chevronUp, openOutline } from 'ionicons/icons'
import { haptic } from 'ios-haptics'
import { ofetch } from 'ofetch'
import { useState } from 'react'
import { formatUrl, relativify } from '@/lib/utils'

interface StoryPageProps {
  match: {
    params: {
      id: string
    }
  }
}

export default function StoryPage({ match: { params } }: StoryPageProps) {
  const [collapsedThreads, setCollapsedThreads] = useState<Set<number>>(() => new Set())

  function toggleCollapse(commentId: number) {
    haptic()
    const newSet = new Set(collapsedThreads)
    newSet[newSet.has(commentId) ? 'delete' : 'add'](commentId)
    setCollapsedThreads(newSet)
  }

  const url = `https://node-hnapi.herokuapp.com/item/${params.id}`

  const { isPending, data: story } = useQuery<Story>({
    queryKey: [`story-${params.id}`],
    queryFn: () => ofetch(url),
  })

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
        {isPending && <IonSpinner className="my-8 w-full" />}

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
                  className="rounded-sm"
                >
                  <img
                    alt=""
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
                    <span className="shrink-0">
                      {relativify(story.time)}
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
            {story.comments.map(comment => (
              <IonList
                key={comment.id}
                className="mb-2"
              >
                <IonItem>
                  <IonLabel>
                    <p
                      onClick={() => {
                        toggleCollapse(comment.id)
                      }}
                      className="flex items-center cursor-pointer"
                    >
                      {comment.user}
                      <span className="mx-2">
                        &bull;
                      </span>
                      {relativify(comment.time)}
                      <span className="ml-auto">
                        {!collapsedThreads.has(comment.id) ? <IonIcon icon={chevronUp} /> : <IonIcon icon={chevronDown} />}
                      </span>
                    </p>
                    {!collapsedThreads.has(comment.id)
                      && (
                        <div>
                          <IonText>
                            <div dangerouslySetInnerHTML={{ __html: comment.content }} />
                          </IonText>
                        </div>
                      )}
                  </IonLabel>
                </IonItem>
                {!collapsedThreads.has(comment.id)
                  && comment.comments.map((reply: Comment) => (
                    <IonItem
                      key={reply.id}
                      style={{ paddingLeft: `${reply.level}rem` }}
                    >
                      <IonLabel>
                        <p className="flex items-center">
                          {reply.user}
                          <span className="mx-2">
                            &bull;
                          </span>
                          {relativify(reply.time)}
                        </p>

                        <IonText>
                          <div dangerouslySetInnerHTML={{ __html: reply.content }} />
                        </IonText>
                      </IonLabel>
                    </IonItem>
                  ))}
              </IonList>
            ))}
          </>
        )}
      </IonContent>
    </IonPage>
  )
}
