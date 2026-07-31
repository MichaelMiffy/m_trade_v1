const TradingViewComponent = () => {
    return (
        <iframe
            id='trading-view-iframe'
            className='trading-view-embed__iframe'
            title='TradingView Chart'
            src='https://charts.deriv.com/deriv?hide-signup=true'
            allow='fullscreen'
        />
    );
};

export default TradingViewComponent;
