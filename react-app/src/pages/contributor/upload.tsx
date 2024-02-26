// material-ui
import { Grid, IconButton, Stack, Typography } from "@mui/material"
import MainCard from "components/MainCard"
import { AppstoreOutlined, UnorderedListOutlined } from "@ant-design/icons"
import { Formik } from "formik"
import * as yup from "yup"
import { FormHelperText } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import UploadSingleFile from "components/third-party/dropzone/SingleFile"
import UploadMultiFile from "components/third-party/dropzone/MultiFile"
import { useState } from "react"

// table data
const createData = (year: number, methodology: string, amount: number) => ({
  year,
  methodology,
  amount,
})

const rows = [
  createData(2024, "Emission Factors", 63.5),
  createData(2023, "Emission Factors", 32),
  createData(2022, "Emission Factors", 10),
  createData(2021, "Emission Factors", 34),
  createData(2020, "Emission Factors", 76),
  createData(2019, "Emission Factors", 8.4),
]

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
            title="Upload Multiple File"
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
        <Grid item xs={12}>
          <MainCard
            title="Upload Single File"
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
        </Grid>
      </Grid>
    </>
  )
}

export default ContributorUpload
