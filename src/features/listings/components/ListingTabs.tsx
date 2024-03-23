import { ArrowForwardIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, HStack, Image, Link, Text } from '@chakra-ui/react';
import dayjs from 'dayjs';
import NextLink from 'next/link';
import { useState } from 'react';

import { EmptySection } from '@/components/shared/EmptySection';

import type { Bounty } from '../types';
import { ListingCard, ListingCardSkeleton } from './ListingCard';

interface TabProps {
  id: string;
  title: string;
  content: JSX.Element;
}

interface ListingTabsProps {
  isListingsLoading: boolean;
  bounties: Bounty[] | undefined;
  take?: number;
  emoji: string;
  title: string;
  viewAllLink?: string;
  showViewAll?: boolean;
  checkLanguage?: boolean;
}

interface ContentProps {
  bounties?: Bounty[];
  take?: number;
  isListingsLoading: boolean;
  filterFunction: (bounty: Bounty) => boolean;
  emptyTitle: string;
  emptyMessage: string;
  checkLanguage: boolean;
}

const generateTabContent = ({
  bounties,
  take,
  isListingsLoading,
  filterFunction,
  emptyTitle,
  emptyMessage,
  checkLanguage,
}: ContentProps) => (
  <Flex direction={'column'} rowGap={1}>
    {isListingsLoading ? (
      Array.from({ length: 8 }, (_, index) => (
        <ListingCardSkeleton key={index} />
      ))
    ) : bounties?.filter(filterFunction).length ? (
      bounties
        .filter(filterFunction)
        .slice(0, take)
        .map((bounty) => (
          <ListingCard
            key={bounty.id}
            bounty={bounty}
            checkLanguage={checkLanguage}
          />
        ))
    ) : (
      <Flex align="center" justify="center" mt={8}>
        <EmptySection title={emptyTitle} message={emptyMessage} />
      </Flex>
    )}
  </Flex>
);

export const ListingTabs = ({
  isListingsLoading,
  bounties,
  take,
  emoji,
  title,
  viewAllLink,
  showViewAll = false,
  checkLanguage = false,
}: ListingTabsProps) => {
  const tabs: TabProps[] = [
    {
      id: 'tab1',
      title: 'OPEN',
      content: generateTabContent({
        bounties: bounties,
        take,
        isListingsLoading,
        filterFunction: (bounty) =>
          bounty.status === 'OPEN' &&
          !dayjs().isAfter(bounty.deadline) &&
          !bounty.isWinnersAnnounced,
        emptyTitle: 'No listings available!',
        emptyMessage:
          'Subscribe to notifications to get notified about new listings.',
        checkLanguage,
      }),
    },
    {
      id: 'tab2',
      title: 'IN REVIEW',
      content: generateTabContent({
        bounties: bounties,
        take,
        isListingsLoading,
        filterFunction: (bounty) =>
          !bounty.isWinnersAnnounced &&
          dayjs().isAfter(bounty.deadline) &&
          bounty.status === 'OPEN',
        emptyTitle: 'No listings in review!',
        emptyMessage:
          'Subscribe to notifications to get notified about updates.',
        checkLanguage,
      }),
    },
    {
      id: 'tab3',
      title: 'COMPLETED',
      content: generateTabContent({
        bounties: bounties,
        take,
        isListingsLoading,
        filterFunction: (bounty) =>
          bounty.status === 'CLOSED' ||
          ((bounty.isWinnersAnnounced || false) && bounty.status === 'OPEN'),
        emptyTitle: 'No completed listings!',
        emptyMessage:
          'Subscribe to notifications to get notified about announcements.',
        checkLanguage,
      }),
    },
  ];

  const [activeTab, setActiveTab] = useState<string>(tabs[0]!.id);

  return (
    <Box my={10}>
      <HStack
        align="center"
        justify="space-between"
        mb={4}
        pb={3}
        borderBottom="2px solid"
        borderBottomColor="#E2E8F0"
      >
        <Flex align={'center'}>
          <Image
            display={{ md: 'block', base: 'none' }}
            w={'1.4375rem'}
            h={'1.4375rem'}
            mr={'0.75rem'}
            alt="emoji"
            src={emoji}
          />
          <Text
            pr={2}
            color={'#334155'}
            fontSize={['13', '14', '16', '16']}
            fontWeight={'600'}
          >
            {title}
          </Text>
          <Text
            display={['none', 'none', 'block', 'block']}
            mx={3}
            color={'brand.slate.300'}
            fontSize={'xxs'}
          >
            |
          </Text>

          {tabs.map((tab) => (
            <Box
              key={tab.id}
              sx={{
                ...(tab.id === activeTab && {
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    right: 0,
                    bottom: '-13px',
                    left: 0,
                    height: '2px',
                    backgroundColor: '#6366f1',
                  },
                }),
              }}
              pos="relative"
              p={2}
              color="#475668"
              fontSize={['x-small', '11', '14', '14']}
              cursor="pointer"
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.title}
            </Box>
          ))}
        </Flex>
        {showViewAll && (
          <Flex>
            <Link as={NextLink} href={viewAllLink}>
              <Button
                px={2}
                py={1}
                color="brand.slate.400"
                fontSize={['x-small', 'sm', 'sm', 'sm']}
                size={{ base: 'x-small', md: 'sm' }}
                variant={'ghost'}
              >
                View All
              </Button>
            </Link>
          </Flex>
        )}
      </HStack>

      {tabs.map((tab) => tab.id === activeTab && tab.content)}

      {showViewAll && (
        <Link as={NextLink} href={viewAllLink}>
          <Button
            w="100%"
            my={8}
            py={5}
            color="brand.slate.400"
            borderColor="brand.slate.300"
            rightIcon={<ArrowForwardIcon />}
            size="sm"
            variant="outline"
          >
            View All
          </Button>
        </Link>
      )}
    </Box>
  );
};
