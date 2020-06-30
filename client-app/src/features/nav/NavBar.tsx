import React, { useContext } from "react";
import { Menu, Button } from "semantic-ui-react";
import ActivityStore from '../../app/stores/activityStore';
import { observer } from "mobx-react-lite";


 const NavBar: React.FC = () => {
  const activityStore = useContext(ActivityStore);
  return (
    <Menu fixed='top' inverted>
      <Menu.Item>
        <img src="/assets/logo.png" alt = "logo" style={{marginRight: '10px'}}/>
        Reactivities
      </Menu.Item>
      <Menu.Item name="Activities" />
      <Menu.Item >
        <Button onClick={activityStore.openCreateForm} positive content="Create Activity"/>
      </Menu.Item>
    </Menu>
  );
};
export default observer( NavBar);