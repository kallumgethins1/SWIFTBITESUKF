export const getServerSideProps = async ({ req }) => {

  // 🚨 ABSOLUTE KEY FIX: skip during build
  if (process.env.SKIP_SSR_FETCH === 'true') {
    return {
      props: {
        configData: null,
        landingPageData: null,
      },
    }
  }

  const language = req.cookies?.languageSetting || 'en'

  let configData = null
  let landingPageData = null

  try {
    const configRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/config`,
      {
        headers: {
          'X-software-id': 33571750,
          'X-server': 'server',
          'X-localization': language,
        },
      }
    )

    if (configRes.ok) {
      configData = await configRes.json()
    }
  } catch (e) {
    console.error('Config fetch failed:', e)
  }

  try {
    const landingRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/landing-page`,
      {
        headers: {
          'X-software-id': 33571750,
        },
      }
    )

    if (landingRes.ok) {
      landingPageData = await landingRes.json()
    }
  } catch (e) {
    console.error('Landing fetch failed:', e)
  }

  return {
    props: {
      configData,
      landingPageData,
    },
  }
}
