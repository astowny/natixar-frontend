// material-ui
import {
  IconButton,
  FormHelperText,
  Grid,
  Stack,
  Typography,
} from "@mui/material"
import MainCard from "components/MainCard"
import { AppstoreOutlined, UnorderedListOutlined } from "@ant-design/icons"
import { Formik } from "formik"
import * as yup from "yup"
import { useTheme } from "@mui/material/styles"
import UploadSingleFile from "components/third-party/dropzone/SingleFile"
import UploadMultiFile from "components/third-party/dropzone/MultiFile"
import { useState } from "react"

const ContributorUpload = () => {
  const [list, setList] = useState(false)
  const theme = useTheme()

  return (
    <>
      <Typography variant="h5" sx={{ marginBottom: "30px" }}>
        Upload
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MainCard
            title="Upload multiple files"
            sx={{ bgcolor: theme.palette.grey.A100 }}
            secondary={
              <Stack direction="row" alignItems="center" spacing={1.25}>
                <IconButton
                  color={list ? "secondary" : "primary"}
                  size="small"
                  onClick={() => setList(false)}
                >
                  <UnorderedListOutlined style={{ fontSize: "1.15rem" }} />
                </IconButton>
                <IconButton
                  color={list ? "primary" : "secondary"}
                  size="small"
                  onClick={() => setList(true)}
                >
                  <AppstoreOutlined style={{ fontSize: "1.15rem" }} />
                </IconButton>
              </Stack>
            }
          >
            <Formik
              initialValues={{ files: null }}
              onSubmit={(values: any) => {
                // submit form
              }}
              validationSchema={yup.object().shape({
                files: yup.mixed().required("Avatar is a required."),
              })}
            >
              {({ values, handleSubmit, setFieldValue, touched, errors }) => (
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Stack spacing={1.5} alignItems="center">
                        <UploadMultiFile
                          showList={list}
                          setFieldValue={setFieldValue}
                          files={values.files}
                          error={touched.files && !!errors.files}
                        />
                      </Stack>
                      {touched.files && errors.files && (
                        <FormHelperText
                          error
                          id="standard-weight-helper-text-password-login"
                        >
                          {errors.files as string}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                </form>
              )}
            </Formik>
          </MainCard>
        </Grid>
        {/* <Grid item xs={12}>
          <MainCard
            title="Upload a single file"
            sx={{ bgcolor: theme.palette.grey.A100 }}
          >
            <Formik
              initialValues={{ files: null }}
              onSubmit={(values: any) => {
                // submit form
              }}
              validationSchema={yup.object().shape({
                files: yup.mixed().required("Avatar is a required."),
              })}
            >
              {({ values, handleSubmit, setFieldValue, touched, errors }) => (
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Stack spacing={1.5} alignItems="center">
                        <UploadSingleFile
                          setFieldValue={setFieldValue}
                          file={values.files}
                          error={touched.files && !!errors.files}
                        />
                      </Stack>
                      {touched.files && errors.files && (
                        <FormHelperText
                          error
                          id="standard-weight-helper-text-password-login"
                        >
                          {errors.files as string}
                        </FormHelperText>
                      )}
                    </Grid>
                  </Grid>
                </form>
              )}
            </Formik>
          </MainCard>
        </Grid> */}
      </Grid>
    </>
  )
}

export default ContributorUpload
