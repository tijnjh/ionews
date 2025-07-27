import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useHead } from '@unhead/react'
import { useEffect, useState } from 'react'
import { Route } from 'react-router'
import HomePage from './pages/HomePage.tsx'
import StoryPage from './pages/StoryPage.tsx'
import '@ionic/react/css/core.css'
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'
import '@ionic/react/css/palettes/dark.system.css'

const queryClient = new QueryClient()
setupIonicReact()

export default function App() {
  const [isDark, setIsDark] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches,
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDark(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  const themeColor = !isDark ? '#f7f7f7' : '#000'

  useHead({
    meta: [{
      name: 'theme-color',
      content: themeColor,
    }],
  })

  return (
    <QueryClientProvider client={queryClient}>
      <IonApp>
        <IonReactRouter>
          <IonRouterOutlet>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/story/:id" component={StoryPage} />
          </IonRouterOutlet>
        </IonReactRouter>
      </IonApp>
    </QueryClientProvider>
  )
}
