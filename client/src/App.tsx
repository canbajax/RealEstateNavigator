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
              const AboutPage = require("./pages/AboutPage").AboutPage;
              return <AboutPage />;
            }}
          </Route>
          <Route path="/agents">
            {() => {
              const AgentsPage = require("./pages/AgentsPage").AgentsPage;
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
