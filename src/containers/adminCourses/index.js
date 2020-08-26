import React from 'react';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';

import AdminCourseList from '../AdminCourseList';
import AdminAddCourse from '../AdminAddCourse';
import AdminEditCourse from '../AdminEditCourse';

const AdminTeachers = (props) => {

    const { path, url } = useRouteMatch();

    return (
      <Switch>
        <Route exact path={path}>
          <Redirect to={`${path}/adminCourseList`} />
        </Route>
        <Route path={`${path}/adminCourseList`}>
          <AdminCourseList path={path} />
        </Route>
        <Route path={`${path}/adminAddCourse`}>
          <AdminAddCourse />
        </Route>
        <Route path={`${path}/adminEditCourse`}>
          <AdminEditCourse />
        </Route>
      </Switch>
    );
}

export default AdminTeachers;