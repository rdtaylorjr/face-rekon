import React, { useEffect, useReducer, useRef, useState } from 'react'
import * as FaceDetector from 'expo-face-detector'
import { Alert, Dimensions, StyleSheet, Text, View } from 'react-native'
import { Camera } from 'expo-camera'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import { useNavigation } from '@react-navigation/native'
import Svg, { Path } from 'react-native-svg'
import Amplify, { API } from 'aws-amplify'

Amplify.configure({
  API: {
    endpoints: [
      {
        name: 'face-payment',
        endpoint: 'https://bhwt4vsv86.execute-api.us-east-2.amazonaws.com/face-payment'
      }
    ]
  }
})

const { width: windowWidth } = Dimensions.get('window')

const detections = {
  BLINK: { promptText: 'Blink both eyes', minProbability: 0.4 },
  TURN_HEAD_LEFT: { promptText: 'Turn head left', maxAngle: -7.5 },
  TURN_HEAD_RIGHT: { promptText: 'Turn head right', minAngle: 7.5 },
  NOD: { promptText: 'Nod', minDiff: 1 },
  SMILE: { promptText: 'Smile', minProbability: 0.7 }
}

const promptsText = {
  noFaceDetected: 'No face detected',
  performActions: 'Perform the following actions:'
}

const detectionsList = [
  'BLINK',
  'TURN_HEAD_LEFT',
  'TURN_HEAD_RIGHT',
  'NOD',
  'SMILE'
]

const initialState = {
  faceDetected: false,
  promptText: promptsText.noFaceDetected,
  detectionsList,
  currentDetectionIndex: 0,
  progressFill: 0,
  processComplete: false
}

export default function Detection() {
  const navigation = useNavigation()
  const [hasPermission, setHasPermission] = useState(false)
  const [state, dispatch] = useReducer(detectionReducer, initialState)
  const rollAngles = useRef()
  const rect = useRef()

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Camera.requestPermissionsAsync()
      setHasPermission(status === 'granted')
    }
    requestPermissions()
  }, [])

  const drawFaceRect = (face) => {
    rect.current?.setNativeProps({
      width: face.bounds.size.width,
      height: face.bounds.size.height,
      top: face.bounds.origin.y,
      left: face.bounds.origin.x
    })
  }

  const onFacesDetected = (result) => {
    if (result.faces.length !== 1) {
      dispatch({ type: 'FACE_DETECTED', value: 'no' })
      return
    }

    const face = result.faces[0]
    const midFaceOffsetY = face.bounds.size.height / 2
    const midFaceOffsetX = face.bounds.size.width / 2

    drawFaceRect(face)
    const faceMidYPoint = face.bounds.origin.y + midFaceOffsetY
    console.log(`face.bounds.origin.y: ${face.bounds.origin.y}`)

    if (faceMidYPoint <= PREVIEW_MARGIN_TOP || faceMidYPoint >= PREVIEW_SIZE + PREVIEW_MARGIN_TOP) {
      dispatch({ type: 'FACE_DETECTED', value: 'no' })
      return
    }

    const faceMidXPoint = face.bounds.origin.x + midFaceOffsetX
    if (faceMidXPoint <= windowWidth / 2 - PREVIEW_SIZE / 2 || faceMidXPoint >= windowWidth / 2 + PREVIEW_SIZE / 2) {
      dispatch({ type: 'FACE_DETECTED', value: 'no' })
      return
    }

    if (!state.faceDetected) {
      dispatch({ type: 'FACE_DETECTED', value: 'yes' })
    }

    const detectionAction = state.detectionsList[state.currentDetectionIndex]

    switch (detectionAction) {
      case 'BLINK':
        const leftEyeClosed =
          face.leftEyeOpenProbability <= detections.BLINK.minProbability
        const rightEyeClosed =
          face.rightEyeOpenProbability <= detections.BLINK.minProbability
        if (leftEyeClosed && rightEyeClosed) {
          dispatch({ type: 'NEXT_DETECTION', value: null })
        }
        return
      case 'NOD':
        rollAngles.current.push(face.rollAngle)

        if (rollAngles.current.length > 10) {
          rollAngles.current.shift()
        }

        if (rollAngles.current.length < 10) return

        const rollAnglesExceptCurrent = [...rollAngles.current].splice(
          0,
          rollAngles.current.length - 1
        )
        const rollAnglesSum = rollAnglesExceptCurrent.reduce((prev, curr) => {
          return prev + Math.abs(curr)
        }, 0)
        const avgAngle = rollAnglesSum / rollAnglesExceptCurrent.length

        const diff = Math.abs(avgAngle - Math.abs(face.rollAngle))

        if (diff >= detections.NOD.minDiff) {
          dispatch({ type: 'NEXT_DETECTION', value: null })
        }
        return
      case 'TURN_HEAD_LEFT':
        if (face.yawAngle <= detections.TURN_HEAD_LEFT.maxAngle) {
          dispatch({ type: 'NEXT_DETECTION', value: null })
        }
        return
      case 'TURN_HEAD_RIGHT':
        if (face.yawAngle >= detections.TURN_HEAD_RIGHT.minAngle) {
          dispatch({ type: 'NEXT_DETECTION', value: null })
        }
        return
      case 'SMILE':
        if (face.smilingProbability >= detections.SMILE.minProbability) {
          dispatch({ type: 'NEXT_DETECTION', value: null })
        }
        return
    }
  }

  const verifyFace = (photo) => {
    const apiName = 'face-payment'
    const path = '/verify'

    const init = {
      headers: {
        "Accept": "application/json",
        "X-Amz-Target": "RekognitionService.SearchFacesByImage",
        "Content-Type": "application/x-amz-json-1.1"
      },
      body: JSON.stringify({
        name: '',
        Image: photo.base64
      })
    }

    API.post(apiName, path, init).then(response => {
      if (response.errorMessage) {
        throw response.errorMessage
      }
      const parsed = JSON.parse(response.body)
      if (JSON.stringify(parsed.FaceMatches.length) > 0) {
        navigation.navigate('Confirmation', {
          username: parsed.FaceMatches[0].Face.ExternalImageId,
          amount: route.params.paymentAmount,
          type: 'payment'
        })
      }
      else {
        navigation.navigate('Confirmation', {
          type: 'failed'
        })
      }
    }).catch(error => {
      Alert.alert('Error', error)
      navigation.navigate('Home')
    })
  }

  const captureImage = async () => {
    if (cameraRef) {
      let photo = await cameraRef.takePictureAsync({ base64: true })
      verifyFace(photo)
    }
    else {
      navigation.navigate('Verification', {
        paymentAmount: route.params.paymentAmount
      })
    }
  }

  useEffect(() => {
    if (state.processComplete) {
      captureImage()
    }
  }, [state.processComplete])

  if (hasPermission === false) {
    return <Text style={{ textAlign: "center", marginTop: 100 }}>No access to camera</Text>
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          position: "absolute",
          top: 0,
          width: "100%",
          height: PREVIEW_MARGIN_TOP,
          backgroundColor: "white",
          zIndex: 10
        }}
      />
      <View
        style={{
          position: "absolute",
          top: PREVIEW_MARGIN_TOP,
          left: 0,
          width: (windowWidth - PREVIEW_SIZE) / 2,
          height: PREVIEW_SIZE,
          backgroundColor: "white",
          zIndex: 10
        }}
      />
      <View
        style={{
          position: "absolute",
          top: PREVIEW_MARGIN_TOP,
          right: 0,
          width: (windowWidth - PREVIEW_SIZE) / 2 + 1,
          height: PREVIEW_SIZE,
          backgroundColor: "white",
          zIndex: 10
        }}
      />

      <Camera
        style={styles.cameraPreview}
        type={Camera.Constants.Type.front}
        onFacesDetected={onFacesDetected}
        faceDetectorSettings={{
          mode: FaceDetector.Constants.Mode.fast,
          detectLandmarks: FaceDetector.Constants.Landmarks.none,
          runClassifications: FaceDetector.Constants.Classifications.all,
          minDetectionInterval: 0,
          tracking: false
        }}
      >
        <CameraPreviewMask width={"100%"} style={styles.circularProgress} />
        <AnimatedCircularProgress
          style={styles.circularProgress}
          size={PREVIEW_SIZE}
          width={5}
          backgroundWidth={7}
          fill={state.progressFill}
          tintColor="#3485FF"
          backgroundColor="#e8e8e8"
        />
      </Camera>
      <View
        ref={rect}
        style={{
          position: "absolute",
          borderWidth: 2,
          borderColor: "pink",
          zIndex: 10
        }}
      />
      <View style={styles.promptContainer}>
        <Text style={styles.faceStatus}>
          {!state.faceDetected && promptsText.noFaceDetected}
        </Text>
        <Text style={styles.actionPrompt}>
          {state.faceDetected && promptsText.performActions}
        </Text>
        <Text style={styles.action}>
          {state.faceDetected &&
            detections[state.detectionsList[state.currentDetectionIndex]]
              .promptText}
        </Text>
      </View>
    </View>
  )
}

const detectionReducer = (state, action) => {
  const numDetections = state.detectionsList.length
  const newProgressFill = (100 / (numDetections + 1)) * (state.currentDetectionIndex + 1)

  switch (action.type) {
    case 'FACE_DETECTED':
      if (action.value === 'yes')
        return { ...state, faceDetected: true, progressFill: newProgressFill }
      else
        return initialState
    case 'NEXT_DETECTION':
      const nextIndex = state.currentDetectionIndex + 1
      if (nextIndex === numDetections)
        return { ...state, processComplete: true, progressFill: 100 }
      else
        return { ...state, currentDetectionIndex: nextIndex, progressFill: newProgressFill }
    default:
      throw new Error('Unexpeceted action type.')
  }
}

const CameraPreviewMask = (props) => (
  <Svg width={300} height={300} viewBox="0 0 300 300" fill="none" {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M150 0H0v300h300V0H150zm0 0c82.843 0 150 67.157 150 150s-67.157 150-150 150S0 232.843 0 150 67.157 0 150 0z"
      fill="#fff"
    />
  </Svg>
)

const PREVIEW_MARGIN_TOP = 50
const PREVIEW_SIZE = 300

const styles = StyleSheet.create({
  actionPrompt: {
    fontSize: 20,
    textAlign: "center"
  },
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  promptContainer: {
    position: "absolute",
    alignSelf: "center",
    top: PREVIEW_MARGIN_TOP + PREVIEW_SIZE,
    height: "100%",
    width: "100%",
    backgroundColor: "white"
  },
  faceStatus: {
    fontSize: 24,
    textAlign: "center",
    marginTop: 10
  },
  cameraPreview: {
    flex: 1
  },
  circularProgress: {
    position: "absolute",
    width: PREVIEW_SIZE,
    height: PREVIEW_SIZE,
    top: PREVIEW_MARGIN_TOP,
    alignSelf: "center"
  },
  action: {
    fontSize: 24,
    textAlign: "center",
    marginTop: 10,
    fontWeight: "bold"
  }
})
