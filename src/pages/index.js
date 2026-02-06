import LandingPage from '../components/landingpage'
import React, { useEffect } from 'react'
import PushNotificationLayout from '../components/PushNotificationLayout'
import Meta from '../components/Meta'
import { setGlobalSettings } from "@/redux/slices/global"
import { useDispatch } from 'react-redux'
import { useRouter } from "next/router"
import { CustomHeader } from "@/api/Headers"
import { checkMaintenanceMode } from "@/utils/customFunctions"
import { PHASE_PRODUCTION_BUILD } from 'next/constants'

const Home = ({ configData, landingPageData }) => {
  const router = useRouter()
  const dispatch = useDispatch()

  useEffect(() => {
    if (!configData || !landingPageData) return

    if (
      Object.keys(configData).length === 0 &&
      Object.keys(landingPageData).length === 0
    ) {
      router.push('/404')
      return
    }

    if (checkMaintenanceMode(configData)) {
      router.push('/maintenance')
      return
    }

    dispatch(setGlobalSettings(configData))
  }, [configData, landingPageData, router, dispatch])

  return (
    <>
      <Meta
        title={configData?.business_name || 'SwiftBites'}
        ogImage={
          configData?.base_urls && landingPageData?.banner_section_full
            ? `${configData.base_urls.react_landing_page_images}/${landingPageData.banner_section_full.banner_section_img_full}`
            : undefined
        }
      />

      <PushNotificationLayout>
        {configData && landingPageData && (
          <LandingPage
            global={configData}
            landingPageData={landingPageData}
          />
        )}
      </PushNotificationLayout>
    </>
  )
}

export default Home

// 🚨 THIS IS THE CRITICAL FIX
export const getServerSideProps = async (context) => {

  // 🔒 Skip ALL API calls during build
  if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) {
    return {
      props: {
        configData: null,
        landingPageData: null,
      },
    }
  }

  const { req } = context
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
  } catch (error) {
    console.error('Config fetch failed:', error)
  }

  try {
    const landingRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/landing-page`,
      {
        headers: CustomHeader,
      }
    )

    if (landingRes.ok) {
      landingPageData = await landingRes.json()
    }
  } catch (error) {
    console.error('Landing page fetch failed:', error)
  }

  return {
    props: {
      configData,
      landingPageData,
    },
  }
}
