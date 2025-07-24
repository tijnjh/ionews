import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

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
