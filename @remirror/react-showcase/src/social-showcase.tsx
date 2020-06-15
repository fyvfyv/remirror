import matchSorter from 'match-sorter';
import React, { useCallback, useMemo, useState } from 'react';

import { startCase, take } from '@remirror/core';
import {
  ActiveTagData,
  ActiveUserData,
  MentionChangeParameter,
  SocialEditor,
  SocialEditorProps,
  UserData,
} from '@remirror/react-editor-social';

import { fakeUsers } from './data/fake-users';

const fakeTags = [
  'Tags',
  'Fake',
  'Help',
  'TypingByHand',
  'DontDoThisAgain',
  'ZoroIsAwesome',
  'ThisIsATagList',
  'NeedsStylingSoon',
  'LondonHits',
  'MCM',
];

const userData: UserData[] = fakeUsers.results.map(
  (user): UserData => ({
    avatarUrl: user.picture.thumbnail,
    displayName: startCase(`${user.name.first} ${user.name.last}`),
    id: user.login.uuid,
    username: user.login.username,
    href: `/u/${user.login.username}`,
  }),
);

export { fakeUsers, fakeTags, userData };

export const ExampleSocialEditor = (props: Partial<SocialEditorProps>) => {
  const [mention, setMention] = useState<MentionChangeParameter>();

  const onChange = useCallback((parameter?: MentionChangeParameter) => {
    setMention(parameter);
  }, []);

  const userMatches: ActiveUserData[] = useMemo(
    () =>
      mention && mention.name === 'at' && mention.query
        ? take(
            matchSorter(userData, mention.query, { keys: ['username', 'displayName'] }),
            6,
          ).map((user, index) => ({ ...user, active: index === mention.index }))
        : [],
    [mention],
  );

  const tagMatches: ActiveTagData[] = useMemo(
    () =>
      mention && mention.name === 'tag' && mention.query
        ? take(matchSorter(fakeTags, mention.query), 6).map((tag, index) => ({
            tag,
            active: index === mention.index,
          }))
        : [],
    [mention],
  );

  return (
    <SocialEditor
      {...props}
      attributes={{ 'data-testid': 'editor-social' }}
      userData={userMatches}
      tagData={tagMatches}
      onMentionChange={onChange}
    />
  );
};

export const SOCIAL_SHOWCASE_CONTENT = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          marks: [
            {
              type: 'mention',
              attrs: {
                id: 'blueladybug185',
                label: '@blueladybug185',
                name: 'at',
                href: '/blueladybug185',
                role: 'presentation',
              },
            },
          ],
          text: '@blueladybug185',
        },
        {
          type: 'text',
          text: ' has proven to me most helpful!',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          marks: [
            {
              type: 'autoLink',
              attrs: {
                href: 'http://Random.com',
              },
            },
          ],
          text: 'Random.com',
        },
        {
          type: 'text',
          text: ' on the other hand has not.',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Emojis still make me smile 😋 🙈',
        },
        {
          type: 'text',
          text: " and I'm here for that.",
        },
      ],
    },
  ],
};
