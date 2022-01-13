from IPython.display import HTML
import json
import altair as alt
import altair.vegalite.v3 as v3
import altair_viewer
alt.renderers.enable('mimetype')


vega_url = 'https://cdn.jsdelivr.net/npm/vega@' + v3.SCHEMA_VERSION
vega_lib_url = 'https://cdn.jsdelivr.net/npm/vega-lib'
vega_lite_url = 'https://cdn.jsdelivr.net/npm/vega-lite@' + alt.SCHEMA_VERSION
vega_embed_url = 'https://cdn.jsdelivr.net/npm/vega-embed@3'
noext = "?noext"

paths = {
    'vega': vega_url + noext,
    'vega-lib': vega_lib_url + noext,
    'vega-lite': vega_lite_url + noext,
    'vega-embed': vega_embed_url + noext
}

workaround = """
requirejs.config({{
    baseUrl: 'https://cdn.jsdelivr.net/npm/',
    paths: {}
}});
"""


def add_autoincrement(render_func):
    # Keep track of unique <div/> IDs
    cache = {}

    def wrapped(chart, id="vega-chart", autoincrement=True):
        if autoincrement:
            if id in cache:
                counter = 1 + cache[id]
                cache[id] = counter
            else:
                cache[id] = 0
            actual_id = id if cache[id] == 0 else id + '-' + str(cache[id])
        else:
            if id not in cache:
                cache[id] = 0
            actual_id = id
        return render_func(chart, id=actual_id)
    # Cache will stay outside and
    return wrapped


@add_autoincrement
def render(chart, id="vega-chart"):
    chart_str = """
    <div id="{id}"></div><script>
    require(["vega-embed"], function(vg_embed) {{
        const spec = {chart};     
        vg_embed("#{id}", spec, {{defaultStyle: true}}).catch(console.warn);
        console.log("anything?");
    }});
    console.log("really...anything?");
    </script>
    """

    return HTML(
        chart_str.format(
            id=id,
            chart=json.dumps(chart) if isinstance(
                chart, dict) else chart.to_json(indent=None)
        )
    )


HTML("".join((
    "<script>",
    workaround.format(json.dumps(paths)),
    "</script>",
    "This code block sets up embedded rendering in HTML output and<br/>",
    "provides the function `render(chart, id='vega-chart')` for use below."
)))


def plot_anomalies(forecasted):
    print("plot")
    alt.data_transformers.disable_max_rows()
    interval = alt.Chart(forecasted).mark_area(interpolate="basis", color='#7FC97F').encode(
        x=alt.X('ds:T',  title='Time'),
        y='yhat_upper',
        y2='yhat_lower',
        tooltip=['ds', 'fact', 'yhat_lower', 'yhat_upper']
    ).interactive().properties(
        title='Anomaly Detection in Turbofan Sensor Readings\n'
    )

    fact = alt.Chart(forecasted[forecasted.anomaly == 0]).mark_circle(size=15, opacity=0.7, color='Black').encode(
        x='ds:T',
        y=alt.Y('fact', title='Sensor values'),
        tooltip=['ds', 'fact', 'yhat_lower', 'yhat_upper']
    ).interactive()

    anomalies = alt.Chart(forecasted[forecasted.anomaly != 0]).mark_circle(size=20, color='Red').encode(
        x='ds:T',
        y=alt.Y('fact', title='Sensor values'),
        tooltip=['ds', 'fact', 'yhat_lower', 'yhat_upper'],
        size=alt.Size('importance', legend=None)
    ).interactive()
    # returnedRender = render(alt.layer(interval, fact, anomalies)
    #                         .properties(width=870, height=450)
    #                         .configure_title(fontSize=20))
    # print("returnedRender: ", returnedRender)
    output = alt.layer(interval, fact, anomalies).properties(height = 500, width=800)
    output.show()
    
