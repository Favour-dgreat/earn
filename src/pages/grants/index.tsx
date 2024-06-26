import { Container, Flex, Image, Text, Wrap, WrapItem } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

import { ErrorInfo } from '@/components/shared/ErrorInfo';
import { Loading } from '@/components/shared/Loading';
import { type Grant, GrantEntry } from '@/features/grants';
import { Default } from '@/layouts/Default';
import { Meta } from '@/layouts/Meta';

function Grants() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [grants, setGrants] = useState<Grant[]>([]);
  const getGrants = async () => {
    setIsLoading(true);
    try {
      const grantsData = await axios.get('/api/grants');
      setGrants(grantsData.data);
    } catch (e) {
      setError(true);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!isLoading) return;
    getGrants();
  }, []);

  const colors = [
    '#D2F4FF',
    '#F1FFD2',
    '#D2DFFF',
    '#FFD8D2',
    '#D2FFDC',
    '#D2FFF7',
  ];
  return (
    <>
      <Default
        meta={
          <Meta
            title="Superteam Earn | Grants"
            description="Discover Solana Grants for Development, Art, Content, and more to fund your ideas"
            canonical="https://earn.superteam.fun/grants/"
          />
        }
      >
        <Flex
          pos={'relative'}
          justify={'center'}
          direction={'column'}
          w={'100%'}
          minH={'100vh'}
          bg={'#F5F5F5'}
        >
          <Image
            pos={'absolute'}
            top={'0'}
            right={'0'}
            left={'0'}
            w={'100%'}
            alt=""
            src="/assets/home/bg_grad.svg"
          />
          <Flex
            align={'center'}
            direction={'column'}
            gap={4}
            mt={{ base: 12, md: 24 }}
            mb={12}
            px={4}
          >
            <Text
              fontFamily={'var(--font-serif)'}
              fontSize={[20, 20, 40, 40]}
              fontWeight={700}
            >
              Need funds to build out your idea?
            </Text>
            <Text
              maxW={'680px'}
              color="brand.slate.500"
              fontSize={[16, 16, 24, 24]}
              fontWeight={'400'}
              textAlign={'center'}
            >
              Discover the complete list of crypto grants available to support
              your project.
            </Text>
            <Text color={'brand.slate.400'} fontSize={'md'}>
              Equity-Free • No Bullshit • Fast AF
            </Text>
          </Flex>
          <Container maxW={'7xl'} mb={12}>
            {isLoading && <Loading />}
            {!isLoading && error && <ErrorInfo />}
            {!isLoading && !error && (
              <Wrap justify={'center'} mx="auto" spacing={10}>
                {grants?.map((grant) => {
                  return (
                    <WrapItem key={grant?.id}>
                      <GrantEntry
                        title={grant?.title}
                        shortDescription={grant?.shortDescription}
                        color={
                          colors[Math.floor(Math.random() * colors.length)] ||
                          ''
                        }
                        slug={grant.slug}
                        rewardAmount={grant?.rewardAmount}
                        token={grant?.token}
                        link={grant?.link}
                        icon={
                          grant?.sponsor?.logo ??
                          '/assets/home/placeholder/ph2.png'
                        }
                        logo={grant?.logo}
                      />
                    </WrapItem>
                  );
                })}
              </Wrap>
            )}
          </Container>
        </Flex>
      </Default>
    </>
  );
}

export default Grants;
