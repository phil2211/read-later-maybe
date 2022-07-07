import React, { useContext, useState, useEffect, useRef } from "react";
import Realm from "realm";
import { Link, Task } from "../schemas";
import { useAuth } from "./AuthProvider";

const LinksContext = React.createContext(null);

const LinksProvider = ( props ) => {
  const [links, setLinks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const { user } = useAuth();

  // Use a Ref to store the realm rather than the state because it is not
  // directly rendered, so updating it should not trigger a re-render as using
  // state would.
  const realmRef = useRef(null);

  useEffect(() => {
    if (user == null) {
      console.error("Null user? Needs to log in!");
      return;
    }
          
    const config = {
      schema: [Link.schema],
      sync: {
        user: user,
        flexible: true
      }
    };

    // open a realm for this particular project and get all Links
    Realm.open(config).then((realm) => {
        realmRef.current = realm;
        
        // initialize the subscriptions
        const initSubscription = async () => {
            const realm = realmRef.current
            await realm.subscriptions.update(mutableSubs => {
                mutableSubs.add(
                  realm.objects('Link').filtered(`owner_id == "${user.id}"`),
                  //realm.objects('Task').filtered(`owner_id == "${user.id}"`),
                ); // subscribe to all Links of the logged in user
            });
        };
        initSubscription();

        const syncLinks = realm.objects("Link");
        let sortedLinks = syncLinks.sorted("name");
        setLinks([...sortedLinks]);
        
        // const syncTasks = realm.objects("Link");
        // let sortedTasks = syncTasks.sorted("name");
        // setTasks([...sortedTasks]);

        // we observe changes on the Links, in case Sync informs us of changes
        // started in other devices (or the cloud)
        sortedLinks.addListener(() => {
          console.log("Got new links!");
          setLinks([...sortedLinks]);
        });
      
        // sortedTasks.addListener(() => {
        //   console.log("Got new tasks!");
        //   setTasks([...sortedTasks]);
        // });
    });

    return () => {
      // cleanup function
      closeRealm();
    };
  }, [user]);

  const createLink = (newLinkName, newLinkURL) => {
    const realm = realmRef.current;
    realm.write(() => {
      // Create a new link in the same partition -- that is, using the same user id.
      realm.create(
        "Link",
        new Link({
          name: newLinkName || "New Link",
          url: newLinkURL || "http://",
          owner_id: user.id,
        })
      );
    });
  };

  // Define the function for deleting a link.
  const deleteLink = (link) => {
    const realm = realmRef.current;
    realm.write(() => {
      realm.delete(link);
      // after deleting, we get the Links again and update them
      setLinks([...realm.objects("Link").sorted("name")]);
    });
  };

  const closeRealm = () => {
    const realm = realmRef.current;
      if (realm) {
        realm.close();
        realmRef.current = null;
        setLinks([]);
      }  
  };

  // Render the children within the LinksContext's provider. The value contains
  // everything that should be made available to descendants that use the
  // useTasks hook.
  return (
    <LinksContext.Provider
      value={{
        createLink,
        deleteLink,
        closeRealm,
        links
      }}
    >
      {props.children}
    </LinksContext.Provider>
  );
};

// The useTasks hook can be used by any descendant of the TasksProvider. It
// provides the tasks of the TasksProvider's project and various functions to
// create, update, and delete the tasks in that project.
const useLinks = () => {
    const links = useContext(LinksContext);
    if (links == null) {
        throw new Error("useLinks() called outside of a TasksProvider?"); // an alert is not placed because this is an error for the developer not the user
    }
    return links;
};

export { LinksProvider, useLinks };