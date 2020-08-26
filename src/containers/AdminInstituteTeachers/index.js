import React from 'react';
import { Switch, Route, useRouteMatch, Redirect, useLocation } from 'react-router-dom';

import AdminTeacherList from '../adminTeacherList';
import AdminTeacherProfile from '../adminTeacherProfile';
import AdminAddTeacher from '../AdminAddCompleteTeacher';
import AdminEditTeacher from '../AdminEditCompleteTeacher';

const AdminTeachers = (props) => {

    const { path, url } = useRouteMatch();
    const location = useLocation();
    const {
      state,
    } = location;

    return (
      <Switch>
        <Route exact path={path}>
          <Redirect to={{ pathname: `${path}/adminTeacherList`, state }} />
        </Route>
        <Route path={`${path}/adminTeacherList`}>
          <AdminTeacherList path={path} />
        </Route>
        <Route path={`${path}/adminTeacherProfile`}>
          <AdminTeacherProfile />
        </Route>
        <Route path={`${path}/adminAddTeacher`}>
          <AdminAddTeacher />
        </Route>
        <Route path={`${path}/adminEditTeacher`}>
          <AdminEditTeacher />
        </Route>
      </Switch>
    );
}

export default AdminTeachers;