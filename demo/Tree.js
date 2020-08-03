import avatarPersonnel from './assets/avatar-personnel.svg';

export const tree = {
  id: 100,
  entity: {
    id: 100,
    avatar: avatarPersonnel,
    name: 'Henry Monger',
    title: 'IT Department',
    subTitle: 'CTO',
    totalReports: 3,
  },

  children: [
    {
      id: 36,
      entity: {
        id: 36,
        avatar: avatarPersonnel,
        name: 'Tomasz Polaski',
        title: 'IT Manager',
        totalReports: 4,
      },

      children: [
        {
          id: 56,
          entity: {
            id: 56,
            avatar: avatarPersonnel,
            name: 'Sam John',
            title: 'HR',
            totalReports: 2,
            link: 'https://github.com/smartprocure/react-org-chart',
          },

          children: [
            {
              id: 102,
              entity: {
                id: 102,
                avatar: avatarPersonnel,
                name: 'Hendy Kinger',
                title: 'Manager',
                totalReports: 0,
              },

              children: [],
            },
            {
              id: 455,
              entity: {
                id: 455,
                avatar: avatarPersonnel,
                name: 'Kate Baker',
                title: 'IT Officer',
                totalReports: 0,
              },

              children: [],
            },
          ],
        },
        {
          id: 66,
          entity: {
            id: 66,
            avatar: avatarPersonnel,
            name: 'John Doe',
            title: 'Developer',
            totalReports: 0,
            link: 'https://github.com/smartprocure/react-org-chart',
          },

          children: [],
        },
        {
          id: 76,
          entity: {
            id: 76,
            avatar: avatarPersonnel,
            name: 'Emilia Rogers',
            title: 'Developer',
            totalReports: 0,
            link: 'https://github.com/smartprocure/react-org-chart',
          },

          children: [],
        },
        {
          id: 60,
          entity: {
            id: 60,
            avatar: avatarPersonnel,
            name: 'Ellen Cott',
            title: 'IT Officer',
            totalReports: 0,
          },

          children: [],
        },
      ],
    },
    {
      id: 32,
      entity: {
        id: 32,
        avatar: avatarPersonnel,
        name: 'Emanuel Walker',
        title: 'IT Specialist',
        totalReports: 1,
      },

      children: [{
        id: 710,
        entity: {
          id: 710,
          avatar: avatarPersonnel,
          name: 'Kenneth Thoe',
          title: 'IT Champ',
          totalReports: 0,
        },

        children: [],
      }],
    },
    {
      id: 25,
      entity: {
        id: 25,
        avatar: avatarPersonnel,
        name: 'Kerry Peter',
        title: 'IT Specialist',
        totalReports: 2,
      },

      children: [
        {
          id: 70,
          entity: {
            id: 70,
            avatar: avatarPersonnel,
            name: 'Kenneth Dom',
            title: 'IT Officer',
            totalReports: 0,
          },

          children: [],
        },
        {
          id: 45,
          entity: {
            id: 45,
            avatar: avatarPersonnel,
            name: 'Kin Baker',
            title: 'IT Officer',
            totalReports: 0,
          },

          children: [],
        },
      ],
    },
  ],
};
