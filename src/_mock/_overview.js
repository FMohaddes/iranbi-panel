import { _mock } from "./_mock";

export const _analyticOrderTimeline = [ ...Array( 5 ) ].map( ( _ , index ) => {
  const title = [ "۲۴، سفارشات، ۴۲۲۰۰۰ تومان" , "۱۲ فاکتور پرداخت شده‌اند" , "سفارش شماره ۳۷۷۴۵ از اسفند" , "سفارش جدید ثبت شد #XF-2356" , "سفارش جدید ثبت شد #XF-2346" , ][ index ];

  return {
    id   : _mock.id( index ) ,
    title ,
    type : `order${ index + 1 }` ,
    time : _mock.time( index ) ,
  };
} );

// ECOMMERCE
// ----------------------------------------------------------------------

export const _ecommerceSalesOverview = [ "سود کل" , "درآمد کل" , "هزینه‌های کل" ].map( ( label , index ) => ( {
  label ,
  totalAmount : _mock.number.price( index ) * 100 ,
  value       : _mock.number.percent( index ) ,
} ) );
