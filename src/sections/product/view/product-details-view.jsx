"use client";

import useSWR from "swr";
import { useParams } from "next/navigation";
import {
  useState , useEffect , useCallback
} from "react";

import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Unstable_Grid2";

import { paths } from "src/routes/paths";

import { useTabs } from "src/hooks/use-tabs";

import { varAlpha } from "src/theme/styles";
import {
  PRODUCT_PUBLISH_OPTIONS
} from "src/_mock";
import {
  DashboardContent
} from "src/layouts/dashboard";

import {
  fetcher , endpoints
} from "../../../utils/axios";
import {
  ProductDetailsSummary
} from "../product-details-summary";
import {
  ProductDetailsToolbar
} from "../product-details-toolbar";
import {
  ProductDetailsCarousel
} from "../product-details-carousel";
import {
  ProductDetailsDescription
} from "../product-details-description";

// ----------------------------------------------------------------------
const swrOptions = {
  revalidateIfStale     : false ,
  revalidateOnFocus     : false ,
  revalidateOnReconnect : false ,
};

export function ProductDetailsView() {
  const tabs = useTabs( "description" );
  const { id } = useParams();

  const {
    data ,
    isLoading ,
    error ,
    isValidating
  } = useSWR( endpoints.product.detail( id ) , fetcher , swrOptions )
  const product = data?.data || {}

  const [ publish , setPublish ] = useState( "" );

  useEffect( () => {
    if( product ) {
      setPublish( product?.publish );
    }
  } , [ product ] );

  const handleChangePublish = useCallback( ( newValue ) => {
    setPublish( newValue );
  } , [] );

  return ( <DashboardContent >
      <ProductDetailsToolbar
        backLink = { paths.dashboard.product.root }
        editLink = { paths.dashboard.product.edit( `${ product?.id }` ) }
        liveLink = { paths.product.details( `${ product?.id }` ) }
        publish = { publish }
        onChangePublish = { handleChangePublish }
        publishOptions = { PRODUCT_PUBLISH_OPTIONS }
      />

      <Grid container spacing = { {
        xs : 3 ,
        md : 5 ,
        lg : 8
      } } >
        <Grid xs = { 12 } md = { 6 } lg = { 7 } >
          <ProductDetailsCarousel
            images = { product?.images ?? [] } />
        </Grid >

        <Grid xs = { 12 } md = { 6 } lg = { 5 } >
          { product &&
            <ProductDetailsSummary disableActions
              product = { product } /> }
        </Grid >
      </Grid >

      <Card >
        <Tabs
          value = { tabs.value }
          onChange = { tabs.onChange }
          sx = { {
            px        : 3 ,
            boxShadow : ( theme ) => `inset 0 -2px 0 0 ${ varAlpha( theme.vars.palette.grey[ "500Channel" ] , 0.08 ) }` ,
          } }
        >
          { [ {
            value : "description" ,
            label : "توضیحات"
          } , ].map( ( tab ) => (
            <Tab key = { tab.value }
              value = { tab.value }
              label = { tab.label } /> ) ) }
        </Tabs >

        { tabs.value === "description" && (
          <ProductDetailsDescription
            description = { product?.description ?? "" } /> ) }

      </Card >
    </DashboardContent > );
}
