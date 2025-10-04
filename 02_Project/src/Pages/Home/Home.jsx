import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAnimationOnce } from '../../components/Framer/useAnimateOnce'
import Header from '../../components/Header/Header'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'
import AppDownload from '../../components/AppDownload/AppDownload'

const Home = () => {
  const [category, setCategory] = useState("All")

  // session-once flags for scroll animation
  const headerAnimated = useAnimationOnce("header")
  const appDownloadAnimated = useAnimationOnce("appDownload")

  return (
    <div>
      {/* Header section */}
      <motion.div
        initial={headerAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        whileInView={headerAnimated ? {} : { opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Header />
      </motion.div>

      <ExploreMenu category={category} setCategory={setCategory}/>
      <FoodDisplay category={category}/>

      {/* AppDownload section */}
      <motion.div
        initial={appDownloadAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        whileInView={appDownloadAnimated ? {} : { opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <AppDownload />
      </motion.div>
    </div>
  )
}

export default Home
