import { faker } from '@faker-js/faker';

type RawNode = {
  id: string;
  name: string;
  title: string;
  link: string;
  reportsTo: {
    id: string;
  } | null;
};

const PROFILE_LINK = 'https://github.com/scttcper/react-orgchart';
const ROOT_ID = 'A';
const NODE_COUNT = 140;

faker.seed(42);

const makePerson = (): Pick<RawNode, 'name' | 'title' | 'link'> => ({
  name: faker.person.fullName(),
  title: faker.person.jobTitle(),
  link: PROFILE_LINK,
});

const nodes: RawNode[] = [
  {
    id: ROOT_ID,
    ...makePerson(),
    reportsTo: null,
  },
];

for (let i = 1; i < NODE_COUNT; i += 1) {
  const parent = faker.helpers.arrayElement(nodes);

  nodes.push({
    id: faker.string.uuid(),
    ...makePerson(),
    reportsTo: {
      id: parent.id,
    },
  });
}

export const data = nodes;
