import React, { useState, useEffect, Fragment, SyntheticEvent } from "react";
import { Container } from "semantic-ui-react";
import { IActivity } from "../models/activity";
import { NavBar } from "../../features/nav/NavBar";
import { ActivityDashboard } from "../../features/activities/dashboard/ActivityDashboard";
import agent from "../api/agent";
import { LoadingComponent } from "./LoadingComponent";
//import { act } from "react-dom/test-utils";

const App = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(
    null
  );
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmmiting] = useState(false);
  const [target, setTarget] = useState('');

  const handleSelectActivity = (id: String) => {
    setSelectedActivity(activities.filter((a) => a.id === id)[0]);
    setEditMode(false);
  };

  const handleOpenCreateForm = () => {
    setSelectedActivity(null);
    setEditMode(true);
  };

  const handleCreateActivity = (activity: IActivity) => {
    setSubmmiting(true);
    agent.Activities.create(activity).then(() => {
      setActivities([...activities, activity]);
      setSelectedActivity(activity);
      setEditMode(false);
    }).then(()=>setSubmmiting(false));
  };

  const handleEditActivity = (activity: IActivity) => {
    setSubmmiting(true);
    agent.Activities.update(activity).then(()=>{
      setActivities([
        ...activities.filter((a) => a.id !== activity.id),activity]);
      setSelectedActivity(activity);
      setEditMode(false);
    }).then(()=>setSubmmiting(false));
  };

  const handleDeleteActivity = (event:SyntheticEvent<HTMLButtonElement>, id: string) => {
    setSubmmiting(true);
    setTarget(event.currentTarget.name);
    agent.Activities.delete(id).then(()=> {
      setActivities([...activities.filter((a) => a.id !== id)]);
    }).then(()=>setSubmmiting(false));    
  };

  useEffect(() => {
    //axios
    // .get<IActivity[]>("http://localhost:5000/api/activities")
    agent.Activities.list().then((response) => {
      let activities: IActivity[] = [];
      response.forEach((activity) => {
        activity.date = activity.date.split(".")[0];
        activities.push(activity);
      });
      setActivities(activities);
    }).then(()=> setLoading(false));
  }, []);

  if(loading) return <LoadingComponent content="Loading activities..."/>

  return (
    <Fragment>
      <NavBar openCreateForm={handleOpenCreateForm} />
      <Container style={{ marginTop: "7em" }}>
        <ActivityDashboard
          activities={activities}
          selectActivity={handleSelectActivity}
          selectedActivity={selectedActivity}
          editMode={editMode}
          setEditMode={setEditMode}
          setSelectedActivity={setSelectedActivity}
          createActivity={handleCreateActivity}
          editActivity={handleEditActivity}
          deleteActivity={handleDeleteActivity}
          submitting={submitting}
          target={target}
        />
      </Container>
    </Fragment>
  );
};

export default App;
