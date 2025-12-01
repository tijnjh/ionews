import type { RouteComponentProps } from 'react-router-dom'
import type { Story } from '@/lib/types'
import { IonAvatar, IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonPage, IonRefresher, IonRefresherContent, IonSearchbar, IonSpinner, IonTitle, IonToolbar } from '@ionic/react'
import { useQuery } from '@tanstack/react-query'

import { Fragment, useState } from 'react'
import StoryListing from '@/components/StoryListing'

interface SearchResult {
  hits: Array<{
    author: string
    children: number[]
    created_at: string
    created_at_i: number
    num_comments: number
    objectID: string
    points: number
    story_id: number
    title: string
    updated_at: string
    url: string
  }>
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState<string>('')

  const {
    isPending,
    data,
    refetch,
  } = useQuery<SearchResult>({
    queryKey: ['search', searchQuery],
    queryFn: () =>
      fetch(`http://hn.algolia.com/api/v1/search?query=${encodeURIComponent(searchQuery)}`),
  })

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            Search
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonRefresher
          slot="fixed"
          onIonRefresh={async (e) => {
            await refetch()
            e.detail.complete()
          }}
        >
          <IonRefresherContent />
        </IonRefresher>

        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">
              Search
            </IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonSearchbar
          value={searchQuery}
          showClearButton="focus"
          debounce={500}
          onIonInput={e => setSearchQuery(e.detail.value!)}
        />

        {isPending && <IonSpinner className="my-8 w-full" />}

        <IonList>
          {data?.hits.map(story => (
            <StoryListing
              key={story.objectID}
              story={{
                id: story.story_id,
                title: story.title,
                url: story.url ?? '',
                points: story.points,
                time: story.created_at_i,
                comments_count: story.num_comments,
                comments: [],
                user: story.author,
                time_ago: story.created_at ?? '',
                type: 'link',
                domain: 'hi',
              }}
            />
          ))}
        </IonList>

      </IonContent>
    </IonPage>
  )
}
