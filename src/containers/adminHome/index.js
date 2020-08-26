import React, { useState } from 'react';
import { Switch, Route, useRouteMatch, useHistory, Redirect } from 'react-router-dom';
import GroupIcon from '@material-ui/icons/Group';
import CategoryIcon from '@material-ui/icons/Category';
import SchoolIcon from '@material-ui/icons/School';
import HomeWorkIcon from '@material-ui/icons/HomeWork';

import {
  AdminNavigationBar,
  AdminSideMenu,
} from '../../components';
import AdminCategories from '../adminCategories';
import AdminCourses from '../adminCourses';
import AdminTeachers from '../adminTeachers';
import AdminInstitutes from '../adminInstitutes';

import '../../assets/fonts/fonts.css';
import styles from './index.module.css';

const AdminHome = () => {

  const { path, url } = useRouteMatch();
  const history = useHistory();
  const [isActiveNode, updateActiveNode] = useState(null);

  const menuItemObject = {};
  menuItemObject[`${path}/adminCategories`] = {
    key: 0,
    Icon: () => {
      return (
        <CategoryIcon />
      )
    },
    title: 'Categories',
    onClick: () => {
      history.push(`${url}/adminCategories`);
    },
  };
  menuItemObject[`${path}/adminTeachers`] = {
    key: 1,
    Icon: () => {
      return (
        <GroupIcon />
      )
    },
    title: 'Teachers',
    onClick: () => {
      history.push(`${url}/adminTeachers`);
    },
  };
  menuItemObject[`${path}/adminInstitutes`] = {
    key: 2,
    Icon: () => {
      return (
        <HomeWorkIcon />
      )
    },
    title: 'Institutes',
    onClick: () => {
      history.push(`${url}/adminInstitutes`);
    },
  };
  menuItemObject[`${path}/adminCourses`] = {
    key: 3,
    Icon: () => {
      return (
        <SchoolIcon />
      )
    },
    title: 'Courses',
    onClick: () => {
      history.push(`${url}/adminCourses`);
    },
  };

  const menuItems = Object.values(menuItemObject);

  const renderData = () => {
    return (
      <Switch>
        <Route exact path={path}>
          <Redirect to={`${path}/adminCategories`} />
        </Route>
        <Route path={`${path}/adminCategories`}>
          {() => {
            updateActiveNode(0)
            return(
              <AdminCategories />
            )
          }}
        </Route>
        <Route path={`${path}/adminTeachers`}>
          {() => {
            updateActiveNode(1)
            return(
              <AdminTeachers />
            )
          }}
        </Route>
        <Route path={`${path}/adminInstitutes`}>
          {() => {
            updateActiveNode(2)
            return(
              <AdminInstitutes />
            )
          }}
        </Route>
        <Route path={`${path}/adminCourses`}>
          {() => {
            updateActiveNode(3)
            return(
              <AdminCourses />
            )
          }}
        </Route>
      </Switch>
    )
  }

  return (
    <div className={styles.Home}>
      <AdminNavigationBar />
      <div className={styles.bodyWrapper}>
        <div className={styles.body}>
          <div className={styles.sideMenu}>
            <AdminSideMenu menuItems={menuItems} activeIndex={isActiveNode} />
          </div>
          <div className={styles.content}>
            {renderData()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;