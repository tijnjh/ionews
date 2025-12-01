import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonList, IonPage, IonRefresher, IonRefresherContent, IonSpinner, IonTitle, IonToolbar } from '@ionic/react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { logoGithub } from 'ionicons/icons'
import { Fragment } from 'react'
import * as v from 'valibot'
import StoryListing from '@/components/StoryListing'
// import StoryListing from '@/components/StoryListing'
import { api } from '@/lib/api'
import { Story } from '@/lib/schemas/story'

export default function HomePage() {
  const { isPending, data, refetch, fetchNextPage, hasNextPage, error } = useInfiniteQuery({
    queryKey: ['stories'],
    queryFn: async ({ pageParam }) => {
      return await api('/search', {
        params: {
          tags: 'front_page',
          page: pageParam - 1,
        },
        schema: v.object({
          hits: v.array(Story),
        }),
      })
    },
    initialPageParam: 1,
    getNextPageParam: (_, allPages) => allPages.length + 1,
  })

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="end">
            <IonButton
              href="https://github.com/tijnjh/ionews"
              target="_blank"
            >
              <IonIcon icon={logoGithub} />
            </IonButton>
          </IonButtons>
          <IonTitle>Frontpage</IonTitle>
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
            <IonTitle size="large">Frontpage</IonTitle>
          </IonToolbar>
        </IonHeader>

        {isPending && <IonSpinner className="my-8 w-full" />}
        {/*
        <IonList>
          {data?.pages.map(stories => (
            <Fragment key={stories[0].id}>
              {stories.map(story => (
                <StoryListing key={story.id} story={story} />
              ))}
            </Fragment>
          ))}
        </IonList> */}

        <IonList>
          {data?.pages.map(page => (
            <Fragment key={page.hits[0]?.objectID}>
              {page.hits.map(story => (
                <StoryListing key={story.objectID} story={story} />
              ))}
            </Fragment>
          ))}
        </IonList>

        <IonInfiniteScroll
          disabled={!hasNextPage}
          onIonInfinite={async (e) => {
            await fetchNextPage()
            e.target.complete()
          }}
        >
          <IonInfiniteScrollContent />
        </IonInfiniteScroll>
      </IonContent>
    </IonPage>
  )
}
