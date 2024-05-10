import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent
} from "@mui/material"
import { FocusEvent, ReactNode, useEffect, useState } from "react"
import HttpRequest from "../../../lib/frontend/fechApi"
const EQSelect = (props: {
  labelId: string
  label?: string
  disabled?: boolean
  tabIndex?: number
  error?: boolean
  value?: number
  api?: {
    url: string
    verb: "Get" | "Post"
    body?: any
  }
  externalList?: any[]
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void
  onChange?: (selectedId: number) => void
  errorHandler?: (message: string) => void
}) => {
  const [internalLoading, setInternalLoading] = useState<boolean>(false)
  const [internalDisable, setInternalDisable] = useState<boolean>(false)
  const [internalList, setInternalList] = useState<any[]>([])
  async function processValue() {
    try {
      if (props.api && internalList.length <= 0) {
        let apiResponse
        setInternalLoading(true)
        setInternalDisable(true)
        switch (props.api.verb) {
          case "Get":
            apiResponse = await HttpRequest.Get(props.api.url)
            break
          case "Post":
            apiResponse = await HttpRequest.Post(props.api.url, props.api.body)
            break
        }

        if (apiResponse.success) {
          setInternalList(apiResponse.data)
          setInternalLoading(false)
          setInternalDisable(false)
        } else {
          props.errorHandler
            ? props.errorHandler(apiResponse.message || "api Error")
            : console.log(apiResponse.message || "api Error")
        }
      }
    } catch (error) {
      setInternalLoading(false)
      setInternalDisable(false)
      console.error(error)
      props.errorHandler && props.errorHandler(error)
    }
  }
  const onFocusHandle = async (event: FocusEvent<HTMLInputElement>) => {
    try {
      if (props.api && internalList.length <= 0) {
        let apiResponse
        setInternalLoading(true)
        switch (props.api.verb) {
          case "Get":
            apiResponse = await HttpRequest.Get(props.api.url)
            break
          case "Post":
            apiResponse = await HttpRequest.Post(props.api.url, props.api.body)
            break
        }

        if (apiResponse.success) {
          setInternalList(apiResponse.data)
          setInternalLoading(false)
        } else {
          props.errorHandler
            ? props.errorHandler(apiResponse.message || "api Error")
            : console.log(apiResponse.message || "api Error")
        }
      } else {
        props.onFocus && props.onFocus(event)
      }
    } catch (error) {
      props.errorHandler
        ? props.errorHandler(error.message)
        : console.log(error.message)
    }
  }

  useEffect(() => {
    if (props.value) {
      processValue()
    }
  }, [props.value])

  return (
    <FormControl fullWidth>
      <InputLabel id={props.labelId}>{props.label}</InputLabel>
      <Select
        labelId={props.labelId}
        label={props.label}
        tabIndex={props.tabIndex}
        fullWidth
        error={props.error}
        disabled={props.disabled || internalDisable}
        value={props.value}
        onFocus={onFocusHandle}
        onChange={(event: SelectChangeEvent<number>, child: ReactNode) => {
          props.onChange &&
            props.onChange(
              typeof event.target.value === "string"
                ? parseInt(event.target.value)
                : event.target.value
            )
        }}
      >
        <MenuItem value={0}>Selecione ...</MenuItem>
        {internalLoading ? (
          <MenuItem value={undefined} disabled>
            <Box
              sx={{
                width: "100%",
                height: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 0,
                m: 0
              }}
            >
              <CircularProgress size={18} sx={{ mr: 3 }} />
              Aguarde...
            </Box>
          </MenuItem>
        ) : props.api ? (
          internalList.length > 0 &&
          internalList.map((internalItem, index) => (
            <MenuItem
              key={`internal-list-item-${index}`}
              value={internalItem.id}
              disabled={props.disabled || internalDisable}
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                {internalItem.nome}
                {internalItem.cor && (
                  <Box
                    sx={{
                      backgroundColor: `${internalItem.cor}`,
                      borderRadius: "4px",
                      width: "20px",
                      height: "20px",
                      marginLeft: "10px"
                    }}
                  />
                )}
              </Box>
            </MenuItem>
          ))
        ) : (
          props.externalList &&
          props.externalList.length > 0 &&
          props.externalList.map((externalItem, index) => (
            <MenuItem
              key={`external-list-item-${index}`}
              value={externalItem.id}
              disabled={props.disabled || internalDisable}
            >
              {externalItem.nome}
              {externalItem.cor && (
                <Box
                  sx={{
                    backgroundColor: `${externalItem.cor}`,
                    borderRadius: "4px",
                    width: "20px",
                    height: "20px",
                    marginLeft: "10px"
                  }}
                />
              )}
            </MenuItem>
          ))
        )}
      </Select>
    </FormControl>
  )
}

export default EQSelect
