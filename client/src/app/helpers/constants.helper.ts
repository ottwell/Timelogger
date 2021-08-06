export const constantValues = {
  api: {
    odataContextString: (entityName: string) => `${process.env.REACT_APP_API_BASE_URL}/$metadata#${entityName}/$entity`,
    endpoints: {
      get: {
        projects: "projects?$orderby=DeadLine",
        customers: "customers?$select=Id,Name",
        timeRegistrations: (id: number) => `timeRegistrations?$filter=ProjectId eq ${id}&$orderby=Date`,
      },
      post: {
        timeRegistrations: "timeRegistrations",
      },
      patch: {
        timeRegistrations: (id: number) => `timeRegistrations(${id})`,
      },
    },
  },
  deadlineNoticeDayCount: {
    warning: 7,
    severe: 2,
  },
  miminalTimeRegistrationInMinuts: 30,
};
