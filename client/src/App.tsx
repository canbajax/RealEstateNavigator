import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Listings from "@/pages/Listings";
import ListingDetail from "@/pages/ListingDetail";
import Contact from "@/pages/Contact";
import AuthPage from "@/pages/auth-page";
import AdminPage from "@/pages/admin-page";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";

function Router() {
  return (
    <>
      <Header />
      <main>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/listings" component={Listings} />
          <Route path="/listings/:id" component={ListingDetail} />
          <Route path="/about">
            {() => {
              // Dinamik import kullanarak
              const AboutPageModule = import.meta.glob("./pages/AboutPage.tsx", { eager: true });
              const AboutPage = AboutPageModule["./pages/AboutPage.tsx"].AboutPage;
              return <AboutPage />;
            }}
          </Route>
          <Route path="/agents">
            {() => {
              // Dinamik import kullanarak
              const AgentsPageModule = import.meta.glob("./pages/AgentsPage.tsx", { eager: true });
              const AgentsPage = AgentsPageModule["./pages/AgentsPage.tsx"].AgentsPage;
              return <AgentsPage />;
            }}
          </Route>
          <Route path="/contact" component={Contact} />
          <Route path="/auth" component={AuthPage} />
          <ProtectedRoute path="/admin" component={AdminPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
