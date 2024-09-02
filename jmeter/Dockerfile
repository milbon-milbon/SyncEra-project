# JMeterの公式イメージを使用
FROM justb4/jmeter:5.5

# JMeterのテストプランと結果のディレクトリを指定
COPY test_plan_1.jmx /test_plan_1.jmx
VOLUME /results

# JMeterのコマンドを実行してテストを開始
ENTRYPOINT ["jmeter", "-n", "-t", "/test_plan_1.jmx", "-l", "/results/result.jtl"]
